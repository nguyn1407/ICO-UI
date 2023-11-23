import { ethers } from "ethers";
import { Erc20Interface } from "./interfaces";
import { getUsdtAddress } from "./untils/getAddress";
import { getUsdtAbi } from "./untils/getAbis";

export default class UsdtContract extends Erc20Interface {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getUsdtAddress(), getUsdtAbi());
  }
}
