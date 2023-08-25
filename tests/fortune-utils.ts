import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  CurrenciesStatusUpdated,
  Deposited,
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
  RoundStatusUpdated,
  SignatureValidityPeriodUpdated,
  Unpaused,
  ValuePerEntryUpdated
} from "../generated/Fortune/Fortune"

export function createCurrenciesStatusUpdatedEvent(
  currencies: Array<Address>,
  isAllowed: boolean
): CurrenciesStatusUpdated {
  let currenciesStatusUpdatedEvent = changetype<CurrenciesStatusUpdated>(
    newMockEvent()
  )

  currenciesStatusUpdatedEvent.parameters = new Array()

  currenciesStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "currencies",
      ethereum.Value.fromAddressArray(currencies)
    )
  )
  currenciesStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam("isAllowed", ethereum.Value.fromBoolean(isAllowed))
  )

  return currenciesStatusUpdatedEvent
}

export function createDepositedEvent(
  depositor: Address,
  roundId: BigInt,
  entriesCount: BigInt
): Deposited {
  let depositedEvent = changetype<Deposited>(newMockEvent())

  depositedEvent.parameters = new Array()

  depositedEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam(
      "entriesCount",
      ethereum.Value.fromUnsignedBigInt(entriesCount)
    )
  )

  return depositedEvent
}

export function createDepositsWithdrawnEvent(
  roundId: BigInt,
  depositor: Address,
  depositIndices: Array<BigInt>
): DepositsWithdrawn {
  let depositsWithdrawnEvent = changetype<DepositsWithdrawn>(newMockEvent())

  depositsWithdrawnEvent.parameters = new Array()

  depositsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  depositsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  depositsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "depositIndices",
      ethereum.Value.fromUnsignedBigIntArray(depositIndices)
    )
  )

  return depositsWithdrawnEvent
}

export function createERC20OracleUpdatedEvent(
  erc20Oracle: Address
): ERC20OracleUpdated {
  let erc20OracleUpdatedEvent = changetype<ERC20OracleUpdated>(newMockEvent())

  erc20OracleUpdatedEvent.parameters = new Array()

  erc20OracleUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "erc20Oracle",
      ethereum.Value.fromAddress(erc20Oracle)
    )
  )

  return erc20OracleUpdatedEvent
}

export function createMaximumNumberOfDepositsPerRoundUpdatedEvent(
  maximumNumberOfDepositsPerRound: BigInt
): MaximumNumberOfDepositsPerRoundUpdated {
  let maximumNumberOfDepositsPerRoundUpdatedEvent = changetype<
    MaximumNumberOfDepositsPerRoundUpdated
  >(newMockEvent())

  maximumNumberOfDepositsPerRoundUpdatedEvent.parameters = new Array()

  maximumNumberOfDepositsPerRoundUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "maximumNumberOfDepositsPerRound",
      ethereum.Value.fromUnsignedBigInt(maximumNumberOfDepositsPerRound)
    )
  )

  return maximumNumberOfDepositsPerRoundUpdatedEvent
}

export function createMaximumNumberOfParticipantsPerRoundUpdatedEvent(
  maximumNumberOfParticipantsPerRound: BigInt
): MaximumNumberOfParticipantsPerRoundUpdated {
  let maximumNumberOfParticipantsPerRoundUpdatedEvent = changetype<
    MaximumNumberOfParticipantsPerRoundUpdated
  >(newMockEvent())

  maximumNumberOfParticipantsPerRoundUpdatedEvent.parameters = new Array()

  maximumNumberOfParticipantsPerRoundUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "maximumNumberOfParticipantsPerRound",
      ethereum.Value.fromUnsignedBigInt(maximumNumberOfParticipantsPerRound)
    )
  )

  return maximumNumberOfParticipantsPerRoundUpdatedEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createPrizesClaimedEvent(
  roundId: BigInt,
  winner: Address,
  prizeIndices: Array<BigInt>
): PrizesClaimed {
  let prizesClaimedEvent = changetype<PrizesClaimed>(newMockEvent())

  prizesClaimedEvent.parameters = new Array()

  prizesClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  prizesClaimedEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  prizesClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "prizeIndices",
      ethereum.Value.fromUnsignedBigIntArray(prizeIndices)
    )
  )

  return prizesClaimedEvent
}

export function createProtocolFeeBpUpdatedEvent(
  protocolFeeBp: i32
): ProtocolFeeBpUpdated {
  let protocolFeeBpUpdatedEvent = changetype<ProtocolFeeBpUpdated>(
    newMockEvent()
  )

  protocolFeeBpUpdatedEvent.parameters = new Array()

  protocolFeeBpUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFeeBp",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(protocolFeeBp))
    )
  )

  return protocolFeeBpUpdatedEvent
}

export function createProtocolFeeRecipientUpdatedEvent(
  protocolFeeRecipient: Address
): ProtocolFeeRecipientUpdated {
  let protocolFeeRecipientUpdatedEvent = changetype<
    ProtocolFeeRecipientUpdated
  >(newMockEvent())

  protocolFeeRecipientUpdatedEvent.parameters = new Array()

  protocolFeeRecipientUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFeeRecipient",
      ethereum.Value.fromAddress(protocolFeeRecipient)
    )
  )

  return protocolFeeRecipientUpdatedEvent
}

export function createRandomnessRequestedEvent(
  roundId: BigInt,
  requestId: BigInt
): RandomnessRequested {
  let randomnessRequestedEvent = changetype<RandomnessRequested>(newMockEvent())

  randomnessRequestedEvent.parameters = new Array()

  randomnessRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  randomnessRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )

  return randomnessRequestedEvent
}

export function createReservoirOracleUpdatedEvent(
  reservoirOracle: Address
): ReservoirOracleUpdated {
  let reservoirOracleUpdatedEvent = changetype<ReservoirOracleUpdated>(
    newMockEvent()
  )

  reservoirOracleUpdatedEvent.parameters = new Array()

  reservoirOracleUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "reservoirOracle",
      ethereum.Value.fromAddress(reservoirOracle)
    )
  )

  return reservoirOracleUpdatedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createRoundDurationUpdatedEvent(
  roundDuration: BigInt
): RoundDurationUpdated {
  let roundDurationUpdatedEvent = changetype<RoundDurationUpdated>(
    newMockEvent()
  )

  roundDurationUpdatedEvent.parameters = new Array()

  roundDurationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "roundDuration",
      ethereum.Value.fromUnsignedBigInt(roundDuration)
    )
  )

  return roundDurationUpdatedEvent
}

export function createRoundStatusUpdatedEvent(
  roundId: BigInt,
  status: i32
): RoundStatusUpdated {
  let roundStatusUpdatedEvent = changetype<RoundStatusUpdated>(newMockEvent())

  roundStatusUpdatedEvent.parameters = new Array()

  roundStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  roundStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return roundStatusUpdatedEvent
}

export function createSignatureValidityPeriodUpdatedEvent(
  signatureValidityPeriod: BigInt
): SignatureValidityPeriodUpdated {
  let signatureValidityPeriodUpdatedEvent = changetype<
    SignatureValidityPeriodUpdated
  >(newMockEvent())

  signatureValidityPeriodUpdatedEvent.parameters = new Array()

  signatureValidityPeriodUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "signatureValidityPeriod",
      ethereum.Value.fromUnsignedBigInt(signatureValidityPeriod)
    )
  )

  return signatureValidityPeriodUpdatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createValuePerEntryUpdatedEvent(
  valuePerEntry: BigInt
): ValuePerEntryUpdated {
  let valuePerEntryUpdatedEvent = changetype<ValuePerEntryUpdated>(
    newMockEvent()
  )

  valuePerEntryUpdatedEvent.parameters = new Array()

  valuePerEntryUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "valuePerEntry",
      ethereum.Value.fromUnsignedBigInt(valuePerEntry)
    )
  )

  return valuePerEntryUpdatedEvent
}
