import { createAdminClient } from "./supabase/admin";

export interface VerificationParams {
  txHash: string;
  expectedAmount: string;
  expectedAddress: string;
  chainId: number;
  tokenAddress?: string;
}

export interface VerificationResult {
  verified: boolean;
  confirmations: number;
  txHash: string;
  chainId: number;
}

export interface TransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: bigint;
  status: "success" | "reverted" | "pending";
}

export async function verifyPaymentOnChain(
  params: VerificationParams,
): Promise<VerificationResult> {
  const { txHash, expectedAmount, expectedAddress, chainId, tokenAddress } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  const { data: existing } = await supabase
    .from("payment_verifications")
    .select("id, verified, confirmations")
    .eq("tx_hash", txHash)
    .maybeSingle();

  if (existing) {
    return {
      verified: existing.verified ?? false,
      confirmations: existing.confirmations ?? 0,
      txHash,
      chainId,
    };
  }

  const { data, error } = await supabase.functions.invoke("verify-payment", {
    body: {
      tx_hash: txHash,
      expected_amount: expectedAmount,
      expected_address: expectedAddress,
      chain_id: chainId,
      token_address: tokenAddress ?? null,
    },
  });

  if (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }

  return {
    verified: data.verified ?? false,
    confirmations: data.confirmations ?? 0,
    txHash: data.tx_hash ?? txHash,
    chainId: data.chain_id ?? chainId,
  };
}

export function formatVerificationResult(result: VerificationResult): {
  status: "verified" | "pending" | "failed";
  message: string;
} {
  if (result.verified) {
    return { status: "verified", message: "Payment verified on-chain" };
  }
  if (result.confirmations > 0 && result.confirmations < 6) {
    return {
      status: "pending",
      message: `Waiting for confirmations (${result.confirmations}/6)`,
    };
  }
  return { status: "failed", message: "Payment verification failed" };
}

export function isAmountSufficient(
  actualAmount: string,
  expectedAmount: string,
): boolean {
  const actual = BigInt(actualAmount);
  const expected = BigInt(expectedAmount);
  return actual >= expected;
}
