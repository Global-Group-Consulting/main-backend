/**
 * @typedef {import('../../../@types/dto/statistics/SystemTotalsDto').SystemTotalsDto} SystemTotalsDto
 */

/**
 * @typedef {{
 *   _id: {
 *     movementType: number,
 *     requestType: number
 *   },
 *   totalAmount: number,
 *   totalAmountInterest: number,
 *   actualDeposit: number,
 *   actualInterest: number,
 *   count: number
 * }[]} AggregationResult
 *
 */

const MovementTypes = require('../../../enums/MovementTypes')
const RequestTypes = require('../../../enums/RequestTypes')

/**
 * @this {typeof import('../Movement')}
 *
 * @param {any} filters
 * @param {boolean} out - true if we want to get the totals of the out movements
 *
 * @return {Promise<SystemTotalsDto>}
 */
module.exports.adminTotalsIn = async function (filters = {}, out = false) {
  
  /**
   * @type {AggregationResult}
   */
  const data = await this.aggregateRaw([
    {
      $match: {
        ...filters,
        movementType: {
          '$in': [
            ...MovementTypes.IN_DEPOSIT_TYPES,
            ...MovementTypes.IN_INTEREST_TYPES
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
          totalAmountInterest: {
            $sum: '$interestAmount'
          },
          actualDeposit: {
            $sum: {
              $cond: {
                if: { $eq: ['$movementType', MovementTypes.INTEREST_RECAPITALIZED] },
                then: '$deposit',
                else: 0
              }
            }
          },
          actualInterest: {
            $sum: {
              $cond: {
                if: { $eq: ['$movementType', MovementTypes.INTEREST_RECAPITALIZED] },
                then: '$interestAmount',
                else: 0
              }
            }
          },
          count: {
            $sum: 1
          }
        }
    }
  ])
  
  const deposit = data.reduce((acc, curr) => {
    const inDepositTypes = MovementTypes.IN_DEPOSIT_TYPES.filter(type => type !== MovementTypes.CANCEL_DEPOSIT_COLLECTED)
    
    if (inDepositTypes.includes(curr._id.movementType)) {
      acc += curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const interests = data.reduce((acc, curr) => {
    // non uso ...MovementTypes.IN_INTEREST_TYPES in quanto non mi interessa
    // contare anche l'annullamento riscossione interessi visto
    // che cmq questi vengono già inclusi nell'importo reinvestito
    if ([MovementTypes.INTEREST_RECAPITALIZED].includes(curr._id.movementType)) {
      // uso l'importo reinvestito
      // per tenere traccia del totale delle rendite generate in quel lasso di tempo
      acc += curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const details = data.reduce((acc, curr) => {
    const type = MovementTypes.get(curr._id.movementType).id
    
    if (!acc[type]) {
      acc[type] = 0
    }
    
    acc[type] += curr.totalAmount
    
    return acc
  }, {})
  
  return {
    depositTotal: data.reduce((acc, curr) => curr.actualDeposit + acc, 0),
    interestsTotal: data.reduce((acc, curr) => curr.actualInterest + acc, 0),
    deposit,
    interests,
    details
  }
}
