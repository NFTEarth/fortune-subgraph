import {BigInt} from "@graphprotocol/graph-ts/index";
import {Fortune as FortuneEntity} from "../../generated/schema";

const initializeFortune = () : FortuneEntity => {
  const key = "nftearth"
  let fortuneEntity = FortuneEntity.load(key)

  if (!fortuneEntity) {
    fortuneEntity = new FortuneEntity(key);
    fortuneEntity.totalRounds = BigInt.zero()
  }

  return fortuneEntity
}

export default initializeFortune;