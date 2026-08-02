import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { parseRequestBody } from "../_shared/request-body.ts";
import { supabase } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { chains } from "./chains.ts";
import { verifyPayment } from "./verification.ts";
import {
  ErrorCodes,
  errorResponse,
  successResponse,
} from "./_utils/errors.ts";

/**
 * Errors that mean "keep checking" — the transaction exists on-chain but is
 * still pending or lacks confirmations. Everything else is definitive.
 */
const RETRYABLE_ERRORS = new Set([
  "TX_NOT_FOUND",
  "TX_PENDING",
  "TX_RECEIPT_NOT_FOUND",
  "INSUFFICIENT_CONFIRMATIONS",
  "RPC_URL_NOT_CONFIGURED",
]);

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  let paymentTxId: string | null = null;

  try {
    if (req.method !== "POST") {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Only POST allowed", 405);
    }

    const body = await parseRequestBody(req);
    const { tx_hash, chain_id } = body;

    if (!tx_hash || typeof tx_hash !== "string") {
      return errorResponse(ErrorCodes.MISSING_TX_HASH, "tx_hash is required");
    }

    // Ground truth comes from the DB, never from the request body: the
    // payment record, its order, network, token and receiving wallet.
    const { data: pt, error: ptErr } = await supabase
      .from("payment_transactions")
      .select("id, order_id, user_id, network_id, token_id, receiving_wallet_id, status")
      .eq("tx_hash", tx_hash)
      .maybeSingle();

    if (ptErr) throw new Error(ptErr.message);
    if (!pt) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Payment record not found for this transaction hash", 404);
    }
    paymentTxId = pt.id as string;

    const { data: order } = await supabase
      .from("card_orders")
      .select("id, status, amount_usdc")
      .eq("id", pt.order_id)
      .maybeSingle();
    if (!order) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Order not found", 404);
    }

    const { data: network, error: networkErr } = await supabase
      .from("supported_networks")
      .select("id, chain_id, active")
      .eq("id", pt.network_id)
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

    const { data: token } = await supabase
      .from("supported_tokens")
      .select("symbol, contract_address, decimals, active")
      .eq("id", pt.token_id)
      .maybeSingle();
    if (!token || !token.active) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Token is not active");
    }

    const { data: wallet } = await supabase
      .from("supported_wallet_addresses")
      .select("address, active")
      .eq("id", pt.receiving_wallet_id)
      .maybeSingle();
    if (!wallet || !wallet.active) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Receiving wallet is not active");
    }

    // Cross-check client-supplied chain id against the DB record when provided
    if (typeof chain_id === "number" && chain_id !== chainId) {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "chain_id does not match payment record");
    }

    // A hash can only ever verify one payment (immutable verification log)
    const { data: existing } = await supabase
      .from("payment_verifications")
      .select("id")
      .eq("tx_hash", tx_hash)
      .maybeSingle();

    if (existing) {
      if (pt.status === "confirmed") {
        // Idempotent success — the hash was already verified and recorded.
        return successResponse({ verified: true, tx_hash, chain_id: chainId });
      }
      return errorResponse(ErrorCodes.HASH_ALREADY_USED, "Transaction hash has already been verified");
    }

    const tokenDecimals =
      token.decimals != null && Number.isFinite(Number(token.decimals))
        ? Number(token.decimals)
        : chain.nativeDecimals;

    // Mark as confirming while on-chain checks run; the Transactions page
    // picks this up in real time.
    await supabase
      .from("payment_transactions")
      .update({ status: "confirming" })
      .eq("id", pt.id);

    const result = await verifyPayment(
      {
        txHash: tx_hash,
        expectedAmount: Number(order.amount_usdc).toString(),
        expectedAddress: wallet.address,
        chainId,
        tokenAddress: token.contract_address,
        tokenDecimals,
      },
      chain,
    );

    await supabase.from("payment_verifications").insert({
      tx_hash,
      chain_id: chainId,
      expected_amount: Number(order.amount_usdc).toString(),
      expected_address: wallet.address,
      actual_amount: result.actualAmount,
      from_address: result.fromAddress,
      block_number: result.blockNumber,
      confirmations: result.confirmations,
      verified: result.verified,
    });

    if (result.verified) {
      await supabase
        .from("payment_transactions")
        .update({
          status: "confirmed",
          confirmations: result.confirmations,
          from_address: result.fromAddress,
          to_address: wallet.address,
          block_number: result.blockNumber,
          verified_at: new Date().toISOString(),
        })
        .eq("id", pt.id);

      const internalSecret = Deno.env.get("INTERNAL_SECRET");
      if (internalSecret) {
        await fetch(
          `${Deno.env.get("SUPABASE_URL") ?? ""}/functions/v1/transition-order`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${internalSecret}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: pt.order_id,
              status: "paid",
              tx_hash,
              from_address: result.fromAddress,
            }),
          },
        ).catch((e) => console.error("Failed to transition order:", e));
      } else {
        // No INTERNAL_SECRET configured — transition the order directly so the
        // customer's card syncs into "My Cards" without manual admin action.
        await supabase
          .from("card_orders")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            tx_hash,
            from_address: result.fromAddress,
          })
          .eq("id", pt.order_id);
        await createNotification(
          String(pt.user_id),
          "order_paid",
          { title: "Order Paid", message: "Your payment has been verified on-chain." },
        );
      }
    }

    return successResponse({
      verified: result.verified,
      confirmations: result.confirmations,
      tx_hash,
      chain_id: chainId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "INTERNAL_ERROR";

    if (paymentTxId) {
      try {
        await supabase
          .from("payment_transactions")
          .update({
            status: RETRYABLE_ERRORS.has(message) ? "confirming" : "failed",
            error_message: message,
          })
          .eq("id", paymentTxId);
      } catch {
        // Best-effort sync; the verification error is still reported below.
      }
    }

    const codeMap: Record<string, string> = {
      TX_NOT_FOUND: ErrorCodes.TX_NOT_FOUND,
      TX_PENDING: ErrorCodes.TX_NOT_FOUND,
      TX_FAILED: ErrorCodes.TX_FAILED,
      TX_RECEIPT_NOT_FOUND: ErrorCodes.TX_NOT_FOUND,
      WRONG_TO_ADDRESS: ErrorCodes.WRONG_TO_ADDRESS,
      WRONG_AMOUNT: ErrorCodes.WRONG_AMOUNT,
      INSUFFICIENT_CONFIRMATIONS: ErrorCodes.INSUFFICIENT_CONFIRMATIONS,
      RPC_URL_NOT_CONFIGURED: ErrorCodes.RPC_ERROR,
    };

    const code = codeMap[message] || ErrorCodes.INTERNAL_ERROR;
    const status = code === ErrorCodes.INTERNAL_ERROR ? 500 : 400;

    return errorResponse(code as keyof typeof ErrorCodes, message, status);
  }
});