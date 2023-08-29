import {BigInt} from "@graphprotocol/graph-ts/index";
import {Depositor} from "../../generated/schema";
import {Address} from "@graphprotocol/graph-ts";

const initializeDepositor = (address: Address) : Depositor => {
  let depositor = Depositor.load(address.toHexString())

  if (!depositor) {
    depositor = new Depositor(address.toHexString());
    depositor.address = address
    depositor.biggestETHWon = BigInt.zero()
    depositor.biggestROI =  BigInt.zero()
    depositor.totalRoundsWon = BigInt.zero()
    depositor.totalRoundsPlayed = BigInt.zero()
  }

  return depositor
}

export default initializeDepositor;