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
  // if (getChainIdFromEnv() === CHAIN_ID.MAINNET) {
  //   return process.env.NEXT_PUBLIC_RPC_MAINNET;
  // }
  console.log({ testnet: process.env.NEXT_PUBLIC_RPC_TESTNET });
  return process.env.NEXT_PUBLIC_RPC_TESTNET;
};

export const SMART_ADDRESS = {
  CROWD_SALE: {
    11155111: "0x0558CEBf284D81FDfa9457815cDfC0B1f362A74f",
    56: "",
  },
  USDT: { 11155111: "0x325118259Db6a11Eef14Ee324663fe624fCC6aCa", 56: "" },
  NFT: { 11155111: "0xaA9aa5D835aecDc12F53f4b33127fA88332c18AD", 56: "" },
  MARKET: { 11155111: "0x5d519ceCcFdF7c249fF2fDa4241852791CB1F2Ef", 56: "" },
  FLOPPY: { 11155111: "0x87B515F410B44912Bc7625a017d2A2610475FCEA", 56: "" },
  AUCTION: { 11155111: "0xEdedeFF23454aac926b5d5E9a571F67a5194Acc8", 56: "" },
};
