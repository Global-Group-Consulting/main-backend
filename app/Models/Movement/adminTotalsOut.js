/**
 * @typedef {import('../../../@types/dto/statistics/SystemTotalsDto').SystemTotalsDto} SystemTotalsDto
 */

const MovementTypes = require('../../../enums/MovementTypes')
const RequestTypes = require('../../../enums/RequestTypes')

/**
 * @this {typeof import('../Movement') || typeof import('../../../classes/MongoModel')}
 *
 * @param {any} filters
 *
 * @return {Promise<SystemTotalsDto>}
 */
module.exports.adminTotalsOut = async function (filters = {}) {
  /**
   * @type {{_id: {movementType: number, requestType: number}, totalAmount: number, totalAmountInterest: number, count: number}[]}
   */
  const data = await this.aggregateRaw([
    {
      $match: {
        ...filters,
        movementType: {
          '$in': [
            ...MovementTypes.OUT_DEPOSIT_TYPES,
            ...MovementTypes.OUT_INTEREST_TYPES
          ]
        },
        requestType: {
          '$nin': [
            RequestTypes.COMMISSION_MANUAL_ADD,
            RequestTypes.COMMISSION_MANUAL_TRANSFER,
            RequestTypes.RISC_PROVVIGIONI
          ]
        }
      }
    },
    {
      $group:
        {
          _id: {
            movementType: '$movementType',
            requestType: '$requestType'
          },
          totalAmount: {
            $sum: '$amountChange'
          },
          totalAmountInterest: {
            $sum: '$interestAmount'
          },
          count: {
            $sum: 1
          }
        }
    }
  ])
  
  const withdrewDeposit = data.reduce((acc, curr) => {
    if (MovementTypes.OUT_DEPOSIT_TYPES.includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_DEPOSIT_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const withdrewInterests = data.reduce((acc, curr) => {
    // only NON club interests
    if ([RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(curr._id.requestType)) {
      return acc
    }
    
    if (MovementTypes.OUT_INTEREST_TYPES.includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  // Interessi riscossi brite
  const withdrewInterestsBrite = data.reduce((acc, curr) => {
    // only CLUB interests
    if (![RequestTypes.RISC_INTERESSI_BRITE].includes(curr._id.requestType)) {
      return acc
    }
    
    if (MovementTypes.OUT_INTEREST_TYPES.includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  // Interessi ricossi in oro fisico
  const withdrewInterestsGold = data.reduce((acc, curr) => {
    // only CLUB interests
    if (![RequestTypes.RISC_INTERESSI_GOLD].includes(curr._id.requestType)) {
      return acc
    }
    
    if (MovementTypes.OUT_INTEREST_TYPES.includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  return {
    withdrewInterests,
    withdrewDeposit,
    briteWithdrewInterests: withdrewInterestsBrite,
    goldWithdrewInterests: withdrewInterestsGold
  }
}
