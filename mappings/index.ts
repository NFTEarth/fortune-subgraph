import {
  CurrenciesStatusUpdated as CurrenciesStatusUpdatedEvent,
  Deposited as DepositedEvent,
  DepositsWithdrawn as DepositsWithdrawnEvent,
  PrizesClaimed as PrizesClaimedEvent,
  RoundStatusUpdated as RoundStatusUpdatedEvent,
  RandomnessRequested as RandomnessRequestedEvent,
} from "../generated/Fortune/Fortune"
import {
  Currency,
  Deposit,
  Transaction,
  RoundStatusLog,
} from "../generated/schema"
import {BigInt} from "@graphprotocol/graph-ts/index";
import initializeParticipant from "./utils/initializeParticipant";
import fetchDeposits from "./utils/eth_calls/fetchDeposits";
import { fetchRound } from "./utils/eth_calls/fetchRound";
import initializeRound from "./utils/initializeRound";
import initializeDepositor from "./utils/initializeDepositor";

export function handleCurrenciesStatusUpdated(
  event: CurrenciesStatusUpdatedEvent
): void {
  for(let i = 0; i < event.params.currencies.length; i++) {
    const address = event.params.currencies.at(i)
    let currency = Currency.load(address.toHexString())

    if (!currency) {
      currency = new Currency(
        address.toHexString()
      )
    }

    currency.address = address
    currency.isAllowed = event.params.isAllowed

    currency.save()
  }
}

export function handleDeposited(event: DepositedEvent): void {
  let round = initializeRound(event.params.roundId)
  const participant = initializeParticipant(event.params.roundId, event.params.depositor)
  const depositor = initializeDepositor(event.params.depositor)
  const depositData = fetchDeposits(event.params.roundId)
  const roundData = fetchRound(event.params.roundId)

  if (depositor.lastRoundPlayed.lt(event.params.roundId)) {
    depositor.totalRoundsPlayed = depositor.totalRoundsPlayed.plus(BigInt.fromI32(1))
    depositor.lastRoundPlayed = event.params.roundId;
  }

  const currentDepositData = depositData.at(depositData.length - 1)

  participant.totalNumberOfEntries = participant.totalNumberOfEntries.plus(event.params.entriesCount)

  let deposit = new Deposit(
    event.params.roundId.toString().concat((depositData.length - 1).toString())
  )
  deposit.depositor = event.params.depositor
  deposit.round = event.params.roundId.toString();
  deposit.entriesCount = event.params.entriesCount

  let transaction = new Transaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  transaction.depositor = event.params.depositor
  transaction.round = event.params.roundId.toString()
  transaction.totalNumberOfEntries = participant.totalNumberOfEntries
  transaction.gasLimit = event.transaction.gasLimit
  transaction.gasPrice = event.transaction.gasPrice
  transaction.block = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.hash = event.transaction.hash
  transaction.save()

  deposit.transaction = transaction.id
  deposit.tokenAddress = currentDepositData.tokenAddress
  deposit.tokenAmount = currentDepositData.tokenAmount
  deposit.tokenId = currentDepositData.tokenId
  if (currentDepositData.tokenType === 0) {
    deposit.tokenType = 'ETH'
  }

  if (currentDepositData.tokenType === 1) {
    deposit.tokenType = 'ERC20'
  }

  if (currentDepositData.tokenType === 2) {
    deposit.tokenType = 'ERC721'
  }
  deposit.entriesCount = event.params.entriesCount
  deposit.indice = BigInt.fromI32(depositData.length - 1)
  deposit.claimed = false
  deposit.participant = participant.id

  round.numberOfEntries = round.numberOfEntries.plus(event.params.entriesCount)
  round.numberOfParticipants = roundData.getNumberOfParticipants()

  round.save();
  deposit.save()
  depositor.save();
  participant.save();
}

function filterDeposit (depositIndices: BigInt[], index: number): boolean {
  return depositIndices.includes(BigInt.fromI32(index)) === false
}

export function handleDepositsWithdrawn(event: DepositsWithdrawnEvent): void {
  let round = initializeRound(event.params.roundId)
  let roundData = fetchRound(event.params.roundId)

  for(let i = 0; i < event.params.depositIndices.length; i++) {
    const indice = event.params.depositIndices.at(i)
    let deposit = Deposit.load(event.params.roundId.toString().concat(indice.toString()))

    if (deposit) {
      deposit.claimed = true;
      deposit.save();

      if (round) {
        round.numberOfEntries = round.numberOfEntries.minus(deposit.entriesCount)
        round.numberOfParticipants = roundData.getNumberOfParticipants()

        round.save();
      }
    }
  }
}

export function handlePrizesClaimed(event: PrizesClaimedEvent): void {
  let round = initializeRound(event.params.roundId)
  const roundData = fetchRound(event.params.roundId)
  const deposits = round.deposits.load()

  //event.params.prizeIndices
  //event.params.winner

  for(let i = 0; i < deposits.length; i++) {
    deposits[i].claimed = true;
    deposits[i].save();
  }

  round.protocolFeeOwed = roundData.getProtocolFeeOwed()
  round.save();
}

export function handleRoundStatusUpdated(event: RoundStatusUpdatedEvent): void {
  let round = initializeRound(event.params.roundId)
  let roundData = fetchRound(event.params.roundId);

  let roundLog = new RoundStatusLog(event.transaction.hash.concatI32(event.logIndex.toI32()).toString())
  roundLog.block = event.block.number
  roundLog.timestamp = event.block.timestamp
  roundLog.transaction = event.transaction.hash
  roundLog.status = event.params.status
  roundLog.round = round.id

  const winner = roundData.getWinner();
  round.status = event.params.status
  round.winner = winner
  round.drawnAt = roundData.getDrawnAt()
  round.protocolFeeOwed = roundData.getProtocolFeeOwed()
  round.lastStatusUpdate = event.block.timestamp

  if (event.params.status === 3) {
    let depositor = initializeDepositor(winner)
    const currentEthWon = round.numberOfEntries.times(round.valuePerEntry)
    const deposits = round.deposits.load()

    let winnerEntry = BigInt.zero()
    for (let i = 0; i < deposits.length - 1; i++) {
      if (deposits[i].depositor === winner) {
        winnerEntry = winnerEntry.plus(deposits[i].entriesCount)
      }
    }

    const ROI = round.numberOfEntries.div(winnerEntry)

    depositor.totalRoundsWon = depositor.totalRoundsWon.plus(BigInt.fromI32(1))

    if (currentEthWon > depositor.biggestETHWon) {
      depositor.biggestETHWon = currentEthWon
    }

    if (ROI > depositor.biggestROI) {
      depositor.biggestROI = ROI
    }

    depositor.save();
  }

  roundLog.save()
  round.save();
}


export function handleRandomnessRequested(
  event: RandomnessRequestedEvent
): void {
  let round = initializeRound(event.params.roundId)

  round.drawnHash = event.transaction.hash;

  round.save();
}
