import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Currency } from "../generated/schema"
import { CurrenciesStatusUpdated as CurrenciesStatusUpdatedEvent } from "../generated/Fortune/Fortune"
import { handleCurrenciesStatusUpdated } from "../src/fortune"
import { createCurrenciesStatusUpdatedEvent } from "./fortune-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let currencies = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let isAllowed = true
    let newCurrenciesStatusUpdatedEvent = createCurrenciesStatusUpdatedEvent(
      currencies,
      isAllowed
    )
    handleCurrenciesStatusUpdated(newCurrenciesStatusUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CurrenciesStatusUpdated created and stored", () => {
    assert.entityCount("CurrenciesStatusUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CurrenciesStatusUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "currencies",
      "[0x0000000000000000000000000000000000000001]"
    )
    assert.fieldEquals(
      "CurrenciesStatusUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "isAllowed",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
