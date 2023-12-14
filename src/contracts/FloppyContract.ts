import { ethers } from "ethers";
import { Erc20Interface } from "./interfaces";
import { getFloppyAddress } from "./untils/getAddress";
import { getFloppyAbi } from "./untils/getAbis";

export default class FloppyContract extends Erc20Interface {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getFloppyAddress(), getFloppyAbi());
  }
}
