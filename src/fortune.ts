import {
  Fortune,
  CurrenciesStatusUpdated as CurrenciesStatusUpdatedEvent,
  Deposited as DepositedEvent,
  DepositsWithdrawn as DepositsWithdrawnEvent,
  ERC20OracleUpdated as ERC20OracleUpdatedEvent,
  MaximumNumberOfDepositsPerRoundUpdated as MaximumNumberOfDepositsPerRoundUpdatedEvent,
  MaximumNumberOfParticipantsPerRoundUpdated as MaximumNumberOfParticipantsPerRoundUpdatedEvent,
  Paused as PausedEvent,
  PrizesClaimed as PrizesClaimedEvent,
  ProtocolFeeBpUpdated as ProtocolFeeBpUpdatedEvent,
  ProtocolFeeRecipientUpdated as ProtocolFeeRecipientUpdatedEvent,
  RandomnessRequested as RandomnessRequestedEvent,
  ReservoirOracleUpdated as ReservoirOracleUpdatedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  RoundDurationUpdated as RoundDurationUpdatedEvent,
  RoundStatusUpdated as RoundStatusUpdatedEvent,
  SignatureValidityPeriodUpdated as SignatureValidityPeriodUpdatedEvent,
  Unpaused as UnpausedEvent,
  ValuePerEntryUpdated as ValuePerEntryUpdatedEvent, CancelCall,
} from "../generated/Fortune/Fortune"
import {
  Currency,
  DepositsWithdrawn,
  ERC20OracleUpdated,
  MaximumNumberOfDepositsPerRoundUpdated,
  MaximumNumberOfParticipantsPerRoundUpdated,
  Paused,
  PrizesClaimed,
  ProtocolFeeBpUpdated,
  ProtocolFeeRecipientUpdated,
  RandomnessRequested,
  ReservoirOracleUpdated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  RoundDurationUpdated,
  SignatureValidityPeriodUpdated,
  Unpaused,
  Round,
  Entry,
  Deposit,
} from "../generated/schema"
import {Address, BigInt} from "@graphprotocol/graph-ts/index";

const initializeRound = (address: Address, roundId: BigInt) : Round => {
  let round = Round.load(roundId.toString())

  if (!round) {
    const fortune = Fortune.bind(address)
    const roundData = fortune.rounds(roundId);

    round = new Round(roundId.toString());
    round.roundId = roundId;
    round.cutoffTime = roundData.getCutoffTime()
    round.maximumNumberOfDeposits = roundData.getMaximumNumberOfDeposits()
    round.maximumNumberOfParticipants = roundData.getMaximumNumberOfParticipants()
    round.valuePerEntry = roundData.getValuePerEntry()
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

export function handleCurrenciesStatusUpdated(
  event: CurrenciesStatusUpdatedEvent
): void {
  for(let i = 0; i < event.params.currencies.length; i++) {
    const address = event.params.currencies.at(i)
    let currency = Currency.load(address.toString())

    if (!currency) {
      currency = new Currency(
        address.toString()
      )
    }

    currency.address = address
    currency.isAllowed = event.params.isAllowed

    currency.save()
  }
}

export function handleDeposited(event: DepositedEvent): void {
  const fortune = Fortune.bind(event.address);

  let round = initializeRound(event.address, event.params.roundId)
  const roundData = fortune.rounds(event.params.roundId)
  const depositData = fortune.getDeposits(event.params.roundId)

  const currentDepositData = depositData.at(depositData.length - 1)
  const key = `${event.params.roundId}:${currentDepositData.currentEntryIndex}`

  const entry = new Entry(key)
  entry.roundId = event.params.roundId
  entry.depositor = event.params.depositor
  entry.totalNumberOfEntries = event.params.entriesCount
  entry.save();

  let deposit = new Deposit(
    key
  )
  deposit.depositor = event.params.depositor
  deposit.roundId = event.params.roundId
  deposit.round = event.params.roundId.toString();
  deposit.entriesCount = event.params.entriesCount

  deposit.blockNumber = event.block.number
  deposit.blockTimestamp = event.block.timestamp
  deposit.transactionHash = event.transaction.hash

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
  deposit.numberOfEntries = event.params.entriesCount
  deposit.indice = currentDepositData.currentEntryIndex
  deposit.claimed = false
  deposit.entry = key

  round.numberOfEntries = round.numberOfEntries.plus(event.params.entriesCount)
  round.numberOfParticipants = roundData.getNumberOfParticipants()

  round.save();
  deposit.save()
}

function filterDeposit (depositIndices: BigInt[], index: number): boolean {
  return depositIndices.includes(BigInt.fromI32(index)) === false
}

export function handleDepositsWithdrawn(event: DepositsWithdrawnEvent): void {
  let entity = new DepositsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.roundId = event.params.roundId
  entity.depositor = event.params.depositor
  entity.depositIndices = event.params.depositIndices

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const fortune = Fortune.bind(event.address);

  let round = initializeRound(event.address, event.params.roundId)
  const roundData = fortune.rounds(event.params.roundId)

  for(let i = 0; i < event.params.depositIndices.length; i++) {
    const indice = event.params.depositIndices.at(i)
    let deposit = Deposit.load(`${event.params.roundId}:${indice}`)

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

export function handleERC20OracleUpdated(event: ERC20OracleUpdatedEvent): void {
  let entity = new ERC20OracleUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.erc20Oracle = event.params.erc20Oracle

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMaximumNumberOfDepositsPerRoundUpdated(
  event: MaximumNumberOfDepositsPerRoundUpdatedEvent
): void {
  let entity = new MaximumNumberOfDepositsPerRoundUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.maximumNumberOfDepositsPerRound =
    event.params.maximumNumberOfDepositsPerRound

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMaximumNumberOfParticipantsPerRoundUpdated(
  event: MaximumNumberOfParticipantsPerRoundUpdatedEvent
): void {
  let entity = new MaximumNumberOfParticipantsPerRoundUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.maximumNumberOfParticipantsPerRound =
    event.params.maximumNumberOfParticipantsPerRound

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePrizesClaimed(event: PrizesClaimedEvent): void {
  const fortune = Fortune.bind(event.address);

  let round = initializeRound(event.address, event.params.roundId)
  const roundData = fortune.rounds(event.params.roundId)
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

export function handleProtocolFeeBpUpdated(
  event: ProtocolFeeBpUpdatedEvent
): void {
  let entity = new ProtocolFeeBpUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.protocolFeeBp = event.params.protocolFeeBp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProtocolFeeRecipientUpdated(
  event: ProtocolFeeRecipientUpdatedEvent
): void {
  let entity = new ProtocolFeeRecipientUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.protocolFeeRecipient = event.params.protocolFeeRecipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRandomnessRequested(
  event: RandomnessRequestedEvent
): void {
  let entity = new RandomnessRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.roundId = event.params.roundId
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const fortune = Fortune.bind(event.address);

  let round = Round.load(event.params.roundId.toString())
  const roundData = fortune.rounds(event.params.roundId)

  if (!round) {
    round = initializeRound(event.address, event.params.roundId)
  }
  round.roundId = event.params.roundId;
  round.drawnHash = event.transaction.hash;
  round.winner = roundData.getWinner()
  round.drawnAt = roundData.getDrawnAt()
  round.protocolFeeOwed = roundData.getProtocolFeeOwed()

  round.save();
}

export function handleReservoirOracleUpdated(
  event: ReservoirOracleUpdatedEvent
): void {
  let entity = new ReservoirOracleUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.reservoirOracle = event.params.reservoirOracle

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoundDurationUpdated(
  event: RoundDurationUpdatedEvent
): void {
  let entity = new RoundDurationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.roundDuration = event.params.roundDuration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoundStatusUpdated(event: RoundStatusUpdatedEvent): void {
  let round = initializeRound(event.address, event.params.roundId)
  const fortune = Fortune.bind(event.address)
  const roundData = fortune.rounds(event.params.roundId);

  round.winner = roundData.getWinner()
  round.drawnAt = roundData.getDrawnAt()

  round.status = event.params.status
  round.save();
}

export function handleSignatureValidityPeriodUpdated(
  event: SignatureValidityPeriodUpdatedEvent
): void {
  let entity = new SignatureValidityPeriodUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.signatureValidityPeriod = event.params.signatureValidityPeriod

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleValuePerEntryUpdated(
  event: ValuePerEntryUpdatedEvent
): void {
  const fortune = Fortune.bind(event.address);
  const roundId = fortune.roundsCount()
  const round = initializeRound(event.address, roundId)

  round.valuePerEntry = event.params.valuePerEntry;
  round.save();
}
