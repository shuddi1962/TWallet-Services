export type FundingNetwork = {
  id: string;
  name: string;
  chain_id: number;
  currency: string;
  explorer_url: string | null;
};

export type FundingToken = {
  id: string;
  network_id: string;
  symbol: string;
  name: string;
  contract_address: string | null;
  decimals: number;
};

export type FundingWallet = {
  id: string;
  network_id: string;
  address: string;
  label: string | null;
};

export type FundingSetup = {
  networks: FundingNetwork[];
  tokens: FundingToken[];
  wallets: FundingWallet[];
};
