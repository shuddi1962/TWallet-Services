import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { parseRequestBody } from "../_shared/request-body.ts";
import { supabase } from "../_shared/supabase-admin.ts";
import { chains } from "./chains.ts";
import { verifyPayment } from "./verification.ts";
import {
  ErrorCodes,
  errorResponse,
  successResponse,
} from "./_utils/errors.ts";

/**
 * Verifies a card funding transaction on-chain and credits the card balance
 * exactly once. Ground truth comes from the card_funding row (amount, chain,
 * token, receiving wallet) — the client-supplied values are only cross-checked
 * against the DB, never trusted.
 */
serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    if (req.method !== "POST") {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Only POST allowed", 405);
    }

    const body = await parseRequestBody(req);
    const { funding_id, tx_hash, chain_id, token_address } = body;

    if (!funding_id || typeof funding_id !== "string") {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "funding_id is required");
    }
    if (!tx_hash || typeof tx_hash !== "string") {
      return errorResponse(ErrorCodes.MISSING_TX_HASH, "tx_hash is required");
    }

    // Load the funding request — must exist, not already credited
    const { data: funding, error: fundingErr } = await supabase
      .from("card_funding")
      .select("id, card_id, user_id, amount_usdc, network_id, token_id, receiving_wallet_id, status, credited, tx_hash")
      .eq("id", funding_id)
      .maybeSingle();

    if (fundingErr) throw new Error(fundingErr.message);
    if (!funding) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Funding request not found", 404);
    }
    if (funding.credited) {
      return successResponse({ verified: true, already_credited: true, tx_hash, chain_id });
    }
    if (funding.tx_hash && funding.tx_hash !== tx_hash) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "tx_hash does not match funding request");
    }

    // Reject a hash that was already verified for another card/funding
    const { data: used } = await supabase
      .from("card_funding")
      .select("id")
      .eq("tx_hash", tx_hash)
      .eq("credited", true)
      .maybeSingle();
    if (used) {
      return errorResponse(ErrorCodes.HASH_ALREADY_USED, "Transaction hash has already been used");
    }

    const { data: card } = await supabase
      .from("issued_cards")
      .select("id, balance_usdc, status, frozen")
      .eq("id", funding.card_id)
      .maybeSingle();
    if (!card) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Card not found", 404);
    }
    if (card.frozen || card.status === "frozen") {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Card is frozen", 400);
    }
    if (card.status === "cancelled") {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Card is cancelled", 400);
    }

    // Ground truth from the DB, not the request body
    const amountUsdc = Number(funding.amount_usdc);
    if (!Number.isFinite(amountUsdc) || amountUsdc < 5 || amountUsdc > 50000) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Funding amount out of range (min 5, max 50,000 USDC)");
    }

    const { data: network, error: networkErr } = await supabase
      .from("supported_networks")
      .select("id, chain_id, active")
      .eq("id", funding.network_id)
      .maybeSingle();
    if (networkErr) throw new Error(networkErr.message);
    if (!network || !network.active) {
      return errorResponse(ErrorCodes.UNSUPPORTED_CHAIN, "Network is not active");
    }

    const chainId = Number(network.chain_id);
    const chain = chains[chainId];
    if (!chain) {
      return errorResponse(ErrorCodes.UNSUPPORTED_CHAIN, `Chain ${chainId} is not supported`);
    }

    const { data: token, error: tokenErr } = await supabase
      .from("supported_tokens")
      .select("id, symbol, contract_address, decimals, active")
      .eq("id", funding.token_id)
      .maybeSingle();
    if (tokenErr) throw new Error(tokenErr.message);
    if (!token || !token.active) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Token is not active");
    }

    const { data: wallet, error: walletErr } = await supabase
      .from("supported_wallet_addresses")
      .select("id, address, active")
      .eq("id", funding.receiving_wallet_id)
      .maybeSingle();
    if (walletErr) throw new Error(walletErr.message);
    if (!wallet || !wallet.active) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Receiving wallet is not active");
    }

    // Cross-check client-supplied values against the DB record
    if (typeof chain_id === "number" && chain_id !== chainId) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "chain_id does not match funding request");
    }
    if (token_address && typeof token_address === "string") {
      const tokenAddr = String(token_address).toLowerCase();
      const dbTokenAddr = token.contract_address ? String(token.contract_address).toLowerCase() : "";
      if (dbTokenAddr && tokenAddr !== dbTokenAddr) {
        return errorResponse(ErrorCodes.INVALID_REQUEST, "token_address does not match funding request");
      }
    }

    await supabase
      .from("card_funding")
      .update({ status: "verifying", tx_hash })
      .eq("id", funding.id);

    const result = await verifyPayment(
      {
        txHash: tx_hash,
        expectedAmount: amountUsdc.toString(),
        expectedAddress: wallet.address,
        chainId,
        tokenAddress: token.contract_address,
        tokenDecimals: token.decimals ?? chain.nativeDecimals,
      },
      chain,
    );

    if (!result.verified) {
      await supabase
        .from("card_funding")
        .update({ status: "failed", confirmations: result.confirmations })
        .eq("id", funding.id);
      return successResponse({ verified: false, confirmations: result.confirmations, tx_hash, chain_id: chainId });
    }

    // On-chain verified — credit the card exactly once (guarded by credited flag)
    const nextBalance = Number(card.balance_usdc) + amountUsdc;

    const { error: updateErr } = await supabase
      .from("issued_cards")
      .update({
        balance_usdc: nextBalance,
        last_funded_at: new Date().toISOString(),
      })
      .eq("id", card.id);
    if (updateErr) throw new Error(updateErr.message);

    await supabase.from("card_ledger").insert({
      card_id: card.id,
      user_id: funding.user_id,
      entry_type: "fund",
      amount_usdc: amountUsdc,
      balance_after: nextBalance,
      description: "On-chain crypto funding (verified)",
      reference: `funding_${funding.id}`,
    });

    await supabase
      .from("card_funding")
      .update({
        status: "verified",
        credited: true,
        from_address: result.fromAddress,
        to_address: wallet.address,
        block_number: result.blockNumber,
        confirmations: result.confirmations,
        verified_at: new Date().toISOString(),
      })
      .eq("id", funding.id);

    return successResponse({
      verified: true,
      credited: true,
      confirmations: result.confirmations,
      tx_hash,
      chain_id: chainId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "INTERNAL_ERROR";

    const codeMap: Record<string, string> = {
      TX_NOT_FOUND: ErrorCodes.TX_NOT_FOUND,
      TX_PENDING: ErrorCodes.TX_NOT_FOUND,
      TX_FAILED: ErrorCodes.TX_FAILED,
      TX_RECEIPT_NOT_FOUND: ErrorCodes.TX_NOT_FOUND,
      WRONG_TO_ADDRESS: ErrorCodes.WRONG_TO_ADDRESS,
      WRONG_AMOUNT: ErrorCodes.WRONG_AMOUNT,
      INSUFFICIENT_CONFIRMATIONS: ErrorCodes.INSUFFICIENT_CONFIRMATIONS,
      RPC_URL_NOT_CONFIGURED: ErrorCodes.RPC_ERROR,
      NO_TRANSFER_LOGS: ErrorCodes.WRONG_AMOUNT,
      NO_TRANSFER_EVENT: ErrorCodes.WRONG_AMOUNT,
    };

    const code = codeMap[message] || ErrorCodes.INTERNAL_ERROR;
    const status = code === ErrorCodes.INTERNAL_ERROR ? 500 : 400;

    return errorResponse(code as keyof typeof ErrorCodes, message, status);
  }
});
