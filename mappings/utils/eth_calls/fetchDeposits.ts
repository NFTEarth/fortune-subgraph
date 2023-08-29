import {BigInt} from "@graphprotocol/graph-ts";
import {
  Fortune,
  Fortune__getDepositsResultValue0Struct,
} from "../../../generated/Fortune/Fortune";
import {FORTUNE_ADDRESS} from "../config/address-arbitrum";

const fetchDeposits = (roundId: BigInt): Fortune__getDepositsResultValue0Struct[] => {
  const fortune = Fortune.bind(FORTUNE_ADDRESS);

  return fortune.getDeposits(roundId);
}

export default fetchDeposits