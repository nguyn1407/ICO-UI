export type AddressType = {
  11155111: string;
  56: string;
};

export enum CHAIN_ID {
  TESTNET = 11155111,
  MAINNET = 56,
}

export default function getChainIdFromEnv(): number {
  const env = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!env) {
    return 11155111;
  }
  return parseInt(env);
}

export const getRPC = () => {
  if (getChainIdFromEnv() === CHAIN_ID.MAINNET) {
    return process.env.NEXT_PUBLIC_RPC_MAINNET;
  }
  return process.env.NEXT_PUBLIC_RPC_TESTNET;
};

export const SMART_ADDRESS = {
  CROWD_SALE: {
    11155111: "0x0558CEBf284D81FDfa9457815cDfC0B1f362A74f",
    56: "",
  },
  USDT: { 11155111: "0x325118259Db6a11Eef14Ee324663fe624fCC6aCa", 56: "" },
};
