import {BigInt} from "@graphprotocol/graph-ts/index";
import {Fortune as FortuneEntity, Round} from "../../generated/schema";
import {fetchRound, fetchRoundDuration} from "./eth_calls/fetchRound";

const initializeRound = (roundId: BigInt) : Round => {
  let round = Round.load(roundId.toString())

  if (!round) {
    const roundData = fetchRound(roundId)
    const duration = fetchRoundDuration()

    let fortuneEntity = FortuneEntity.load('fortune')

    if (!fortuneEntity) {
      fortuneEntity = new FortuneEntity('fortune')
      fortuneEntity.totalRounds = BigInt.zero()
    }

    fortuneEntity.totalRounds = fortuneEntity.totalRounds.plus(BigInt.fromI32(1))

    round = new Round(roundId.toString());
    round.roundId = roundId;
    round.cutoffTime = roundData.getCutoffTime()
    round.maximumNumberOfDeposits = roundData.getMaximumNumberOfDeposits()
    round.maximumNumberOfParticipants = roundData.getMaximumNumberOfParticipants()
    round.valuePerEntry = roundData.getValuePerEntry()
    round.duration = duration
    round.status = roundData.getStatus()
    round.numberOfEntries = BigInt.zero()
    round.numberOfParticipants = BigInt.zero()
    round.winner = roundData.getWinner()
    round.drawnAt = roundData.getDrawnAt()
    round.drawnHash = null
    round.protocolFeeBp = roundData.getProtocolFeeBp()
    round.protocolFeeOwed = roundData.getProtocolFeeOwed()
    round.save();
  }

  return round
}

export default initializeRound