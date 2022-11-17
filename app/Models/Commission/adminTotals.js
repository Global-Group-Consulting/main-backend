/**
 * @typedef {import('../../../@types/dto/statistics/CommissionTotalsDto').CommissionTotalsDto} CommissionTotalsDto
 */

const CommissionType = require('../../../enums/CommissionType')

/**
 * @this {typeof import('../Commission')}
 *
 * @param {any} filters
 *
 * @return {Promise<CommissionTotalsDto>}
 */
module.exports.adminTotals = async function (filters = {}) {
  
  /**
   * @type {{_id: {commissionType: string}, totalAmount: number, count: number}[]}
   */
  const data = (await this.db.collection(this.collection)
      .aggregate([
        {
          $match: {
            ...filters
          }
        },
        {
          '$group': {
            '_id': {
              'commissionType': '$commissionType'
            },
            'totalAmount': {
              '$sum': '$amountChange'
            },
            'count': {
              '$sum': 1
            }
          }
        }
      ])
      .toArray()
  )
  
  const total = data.reduce((acc, curr) => {
    if ([CommissionType.NEW_DEPOSIT,
      CommissionType.TOTAL_DEPOSIT,
      CommissionType.MANUAL_ADD,
      CommissionType.ANNUAL_DEPOSIT]
      .includes(curr._id.commissionType)) {
      acc += curr.totalAmount
    } else if ([CommissionType.CANCEL_COMMISSIONS_NEW_DEPOSIT, CommissionType.COMMISSIONS_CANCELLATION].includes(curr._id.commissionType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const withdrawn = data.reduce((acc, curr) => {
    if ([CommissionType.COMMISSIONS_COLLECTED, CommissionType.MANUAL_WITHDRAWAL].includes(curr._id.commissionType)) {
      acc += curr.totalAmount
    } else if ([CommissionType.CANCEL_COMMISSIONS_COLLECTED].includes(curr._id.commissionType)) {
      acc -= curr.totalAmount
    }
    
    return acc
  }, 0)
  
  const reinvested = data.reduce((acc, curr) => {
    if ([CommissionType.COMMISSIONS_TO_REINVEST].includes(curr._id.commissionType)) {
      acc += curr.totalAmount
    }
    
    return acc
  }, 0)
  
  return {
    reinvested,
    withdrawn,
    total
  }
}
