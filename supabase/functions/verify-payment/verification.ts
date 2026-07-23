import type { ChainConfig } from "./chains.ts";
import { getRpcUrl, getTransaction, getTransactionReceipt, getBlockNumber } from "./_utils/rpc.ts";

export interface VerificationInput {
  txHash: string;
  expectedAmount: string;
  expectedAddress: string;
  chainId: number;
  tokenAddress?: string;
}

export interface VerificationResult {
  verified: boolean;
  confirmations: number;
  actualAmount?: string;
  actualTo?: string;
  fromAddress?: string;
  blockNumber?: number;
}

export async function verifyPayment(
  input: VerificationInput,
  chain: ChainConfig,
): Promise<VerificationResult> {
  const rpcUrl = getRpcUrl(String(input.chainId));
  if (!rpcUrl) throw new Error("RPC_URL_NOT_CONFIGURED");

  const tx = await getTransaction(rpcUrl, input.txHash);
  if (!tx) throw new Error("TX_NOT_FOUND");

  const txStatus = tx as Record<string, unknown>;
  if (txStatus.blockNumber === null) throw new Error("TX_PENDING");

  const receipt = await getTransactionReceipt(rpcUrl, input.txHash);
  if (!receipt) throw new Error("TX_RECEIPT_NOT_FOUND");

  const receiptStatus = receipt as Record<string, unknown>;
  if (receiptStatus.status === "0x0") throw new Error("TX_FAILED");

  const toAddress = (txStatus.to as string || "").toLowerCase();
  const expectedAddr = input.expectedAddress.toLowerCase();

  if (toAddress !== expectedAddr && input.tokenAddress) {
    const tokenAddr = input.tokenAddress.toLowerCase();
    if (toAddress !== tokenAddr) throw new Error("WRONG_TO_ADDRESS");
  } else if (toAddress !== expectedAddr) {
    throw new Error("WRONG_TO_ADDRESS");
  }

  const currentBlock = await getBlockNumber(rpcUrl);
  const txBlock = BigInt(txStatus.blockNumber as string);
  const confirmations = Number(currentBlock - txBlock);
  const sender = (txStatus.from as string || "").toLowerCase();

  const result: VerificationResult = {
    verified: false,
    confirmations,
    fromAddress: sender,
    blockNumber: Number(txBlock),
  };

  if (input.tokenAddress) {
    const logs = receiptStatus.logs as Array<Record<string, unknown>> | undefined;
    if (!logs) throw new Error("NO_TRANSFER_LOGS");
    const transferLog = logs.find(
      (log) =>
        (log.address as string).toLowerCase() === input.tokenAddress!.toLowerCase() &&
        (log.topics as string[])[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    );
    if (!transferLog) throw new Error("NO_TRANSFER_EVENT");

    const data = transferLog.data as string;
    const actualAmount = BigInt(data).toString();
    result.actualAmount = actualAmount;

    if (actualAmount !== input.expectedAmount) throw new Error("WRONG_AMOUNT");
  } else {
    const actualAmount = BigInt(txStatus.value as string).toString();
    result.actualAmount = actualAmount;
    if (actualAmount !== input.expectedAmount) throw new Error("WRONG_AMOUNT");
  }

  if (confirmations < chain.requiredConfirmations) {
    throw new Error("INSUFFICIENT_CONFIRMATIONS");
  }

  result.verified = true;
  return result;
}
