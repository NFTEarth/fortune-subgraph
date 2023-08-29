import {BigInt} from "@graphprotocol/graph-ts";
import {Fortune, Fortune__roundsResult} from "../../../generated/Fortune/Fortune";
import {FORTUNE_ADDRESS} from "../config/address-arbitrum";

export const fetchRound = (roundId: BigInt) : Fortune__roundsResult => {
  const fortune = Fortune.bind(FORTUNE_ADDRESS);
  return fortune.rounds(roundId)
}

export const fetchRoundDuration = () : BigInt => {
  const fortune = Fortune.bind(FORTUNE_ADDRESS);

  return fortune.roundDuration()
}
