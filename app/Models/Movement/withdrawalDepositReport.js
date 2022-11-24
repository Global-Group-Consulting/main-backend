/**
 * @typedef {import('../../../@types/dto/statistics/WithdrawalDepositReportDto').WithdrawalDepositReportDto} WithdrawalDepositReportDto
 */

const MovementTypes = require('../../../enums/MovementTypes')

/**
 * @this {typeof import('../Movement')}
 *
 * @param {any} filters
 *
 * @return {Promise<WithdrawalDepositReportDto[]>}
 */
module.exports.withdrawalDepositReport = async function (filters = {}) {
  
  /**
   * @type {WithdrawalDepositReportDto[]}
   */
  const data = await this.aggregateRaw([
        {
          '$match': {
            ...filters,
            'movementType': {
              $in: [MovementTypes.DEPOSIT_COLLECTED, MovementTypes.CANCEL_DEPOSIT_COLLECTED]
            }
          }
        }, {
          '$group': {
            '_id': '$userId',
            'withdrawal': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$movementType', MovementTypes.DEPOSIT_COLLECTED
                    ]
                  },
                  'then': '$amountChange',
                  'else': 0
                }
              }
            },
            'cancellation': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$movementType', MovementTypes.CANCEL_DEPOSIT_COLLECTED
                    ]
                  },
                  'then': '$amountChange',
                  'else': 0
                }
              }
            }
          }
        }, {
          '$addFields': {
            'total': {
              '$subtract': [
                '$withdrawal', '$cancellation'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            // 'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            '_id': 1,
            'total': 1,
            'user': {
              '_id': 1,
              'firstName': 1,
              'lastName': 1
            }
          }
        }, {
          '$sort': {
            total: -1,
            'user.lastName': 1,
            'user.firstName': 1
          }
        }
      ])
  
  return data
}
