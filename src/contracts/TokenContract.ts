import { ethers } from "ethers";
import { Erc20Interface } from "./interfaces";
import { getTokenAddress } from "./untils/getAddress";
import { getTokenAbi } from "./untils/getAbis";

export default class TokenContract extends Erc20Interface {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getTokenAddress(), getTokenAbi());
  }
}
