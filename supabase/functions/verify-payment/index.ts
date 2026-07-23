import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase-admin.ts";
import { chains } from "./chains.ts";
import { verifyPayment } from "./verification.ts";
import {
  ErrorCodes,
  errorResponse,
  successResponse,
} from "./_utils/errors.ts";

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    if (req.method !== "POST") {
      return errorResponse(ErrorCodes.INVALID_REQUEST, "Only POST allowed", 405);
    }

    const body = await req.json();
    const { tx_hash, expected_amount, expected_address, chain_id, token_address } = body;

    if (!tx_hash || typeof tx_hash !== "string") {
      return errorResponse(ErrorCodes.MISSING_TX_HASH, "tx_hash is required");
    }
    if (!expected_amount || typeof expected_amount !== "string") {
      return errorResponse(ErrorCodes.MISSING_EXPECTED_AMOUNT, "expected_amount is required");
    }
    if (!expected_address || typeof expected_address !== "string") {
      return errorResponse(ErrorCodes.MISSING_EXPECTED_ADDRESS, "expected_address is required");
    }
    if (!chain_id || typeof chain_id !== "number") {
      return errorResponse(ErrorCodes.MISSING_CHAIN_ID, "chain_id is required");
    }

    const chain = chains[chain_id];
    if (!chain) {
      return errorResponse(ErrorCodes.UNSUPPORTED_CHAIN, `Chain ${chain_id} is not supported`);
    }

    const { data: existing } = await supabase
      .from("payment_verifications")
      .select("id")
      .eq("tx_hash", tx_hash)
      .maybeSingle();

    if (existing) {
      return errorResponse(ErrorCodes.HASH_ALREADY_USED, "Transaction hash has already been verified");
    }

    const result = await verifyPayment(
      {
        txHash: tx_hash,
        expectedAmount: expected_amount,
        expectedAddress: expected_address,
        chainId: chain_id,
        tokenAddress: token_address,
      },
      chain,
    );

    await supabase.from("payment_verifications").insert({
      tx_hash,
      chain_id,
      expected_amount,
      expected_address,
      actual_amount: result.actualAmount,
      from_address: result.fromAddress,
      block_number: result.blockNumber,
      confirmations: result.confirmations,
      verified: result.verified,
    });

    return successResponse({
      verified: result.verified,
      confirmations: result.confirmations,
      tx_hash,
      chain_id,
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
    };

    const code = codeMap[message] || ErrorCodes.INTERNAL_ERROR;
    const status = code === ErrorCodes.INTERNAL_ERROR ? 500 : 400;

    return errorResponse(code as keyof typeof ErrorCodes, message, status);
  }
});
