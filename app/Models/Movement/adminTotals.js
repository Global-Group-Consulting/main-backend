/**
 * @typedef {import('../../../@types/dto/statistics/SystemTotalsDto').SystemTotalsDto} SystemTotalsDto
 */

const MovementTypes = require('../../../enums/MovementTypes')
const RequestTypes = require('../../../enums/RequestTypes')

/**
 * @this {typeof import('../Movement')}
 *
 * @param {any} filters
 *
 * @return {Promise<SystemTotalsDto>}
 */
module.exports.adminTotals = async function (filters = {}) {
  
  /**
   * @type {{_id: {movementType: number, requestType: number}, totalAmount: number, count: number}[]}
   */
  const data = (await this.db.collection(this.collection)
      .aggregate([
        {
          $match: {
            ...filters,
            movementType: {
              '$nin': [
                MovementTypes.COMMISSION_COLLECTED,
                MovementTypes.COMMISSIONS_REINVESTMENT,
                MovementTypes.CANCEL_COMMISSION_COLLECTED
                // MovementTypes.DEPOSIT_REPAYMENT,
              ]
            },
            requestType: {
              '$nin': [
                RequestTypes.COMMISSION_MANUAL_ADD,
                RequestTypes.COMMISSION_MANUAL_TRANSFER,
                RequestTypes.RISC_INTERESSI_BRITE,
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
              count: {
                $sum: 1
              }
            }
        }
      ])
      .toArray()
  )
  
  const deposit = data.reduce((acc, curr) => {
    if ([MovementTypes.DEPOSIT_ADDED, MovementTypes.INITIAL_DEPOSIT].includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_DEPOSIT_ADDED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const interests = data.reduce((acc, curr) => {
    if ([MovementTypes.INTEREST_RECAPITALIZED].includes(curr._id.movementType)) {
      acc += curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const withdrewDeposit = data.reduce((acc, curr) => {
    if ([MovementTypes.DEPOSIT_COLLECTED].includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_DEPOSIT_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const withdrewInterests = data.reduce((acc, curr) => {
    if ([RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(curr._id.requestType)) {
      return acc
    }
    
    if ([MovementTypes.INTEREST_COLLECTED, MovementTypes.MANUAL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const withdrewInterestsClub = data.reduce((acc, curr) => {
    if (![RequestTypes.RISC_INTERESSI_GOLD].includes(curr._id.requestType)) {
      return acc
    }
    
    if ([MovementTypes.INTEREST_COLLECTED, MovementTypes.MANUAL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc += curr.totalAmount
    } else if ([MovementTypes.CANCEL_INTEREST_COLLECTED].includes(curr._id.movementType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const repayments = data.reduce((acc, curr) => {
    if ([MovementTypes.DEPOSIT_REPAYMENT].includes(curr._id.movementType)) {
      acc += curr.totalAmount
    }
    
    return acc
  }, 0)
  
  return {
    deposit: deposit - withdrewDeposit >= 0 ? deposit - withdrewDeposit : 0,
    interests: interests - withdrewInterests >= 0 ? interests - withdrewInterests : 0,
    withdrewInterests,
    withdrewDeposit,
    goldWithdrewInterests: withdrewInterestsClub,
    repayments
  }
}
