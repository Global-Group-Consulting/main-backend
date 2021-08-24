const MovementTypes = require("../../../enums/MovementTypes");
const RequestTypes = require("../../../enums/RequestTypes");

/**
 * @this {import('../Movement.js')}
 * @return {Promise<void>}
 */
module.exports = /** @this import('../Movement.js') */async function () {
  /**
   * @type {{_id: {movementType: number}, totalAmount: number, count: number}[]}
   */
  const data = (await this.db.collection("movements")
      .aggregate([
        {
          $group:
            {
              _id: {
                movementType: "$movementType",
                requestType: "$requestType"
              },
              totalAmount: {
                $sum: "$amountChange"
              },
              count: {
                $sum: 1
              }
            }
        }
      ])
      .toArray()
  )


  return {
    deposit: data.reduce((acc, curr) => {
      if ([MovementTypes.DEPOSIT_ADDED, MovementTypes.INITIAL_DEPOSIT].includes(curr._id.movementType)) {
        acc += curr.totalAmount
      }

      return acc
    }, 0),

    interests: data.reduce((acc, curr) => {
      if ([MovementTypes.INTEREST_RECAPITALIZED].includes(curr._id.movementType)) {
        acc += curr.totalAmount
      }

      return acc
    }, 0),

    withdrewDeposit: data.reduce((acc, curr) => {
      if ([MovementTypes.DEPOSIT_COLLECTED].includes(curr._id.movementType)) {
        acc += curr.totalAmount
      }

      return acc
    }, 0),

    withdrewInterests: data.reduce((acc, curr) => {
      if ([MovementTypes.INTEREST_COLLECTED].includes(curr._id.movementType)
        && ![RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(curr._id.requestType)) {
        acc += curr.totalAmount
      }

      return acc
    }, 0),

    withdrewInterestsClub: data.reduce((acc, curr) => {
      if ([RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(curr._id.requestType)) {
        acc += curr.totalAmount
      }

      return acc
    }, 0),
  }
}
