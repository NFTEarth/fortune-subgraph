import {BigInt, Bytes} from "@graphprotocol/graph-ts/index";
import {Participant} from "../../generated/schema";

const initializeParticipant = (roundId: BigInt, depositor: Bytes) : Participant => {
  let id = roundId.toString().concat(depositor.toHexString())
  let participant = Participant.load(id)

  if (!participant) {
    participant = new Participant(id);
    participant.depositor = depositor
    participant.round = roundId.toString()
    participant.totalNumberOfEntries = BigInt.zero()
  }

  return participant
}

export default initializeParticipant;