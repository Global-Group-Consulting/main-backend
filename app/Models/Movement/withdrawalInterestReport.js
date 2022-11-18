/**
 * @typedef {import('../../../@types/dto/statistics/WithdrawalInterestReportDto').WithdrawalInterestReportDto} WithdrawalInterestReportDto
 */

const MovementTypes = require('../../../enums/MovementTypes')

/**
 * @this {typeof import('../Movement')}
 *
 * @param {any} filters
 *
 * @return {Promise<WithdrawalInterestReportDto[]>}
 */
module.exports.withdrawalInterestReport = async function (filters = {}) {
  const data = (await this.db.collection(this.collection)
      .aggregate([
        {
          '$match': {
            ...filters,
            'movementType': {
              $in: [MovementTypes.INTEREST_COLLECTED, MovementTypes.MANUAL_INTEREST_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED]
            }
          }
        }, {
          '$group': {
            '_id': '$userId',
            'withdrawal': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$in': [
                      '$movementType', [MovementTypes.INTEREST_COLLECTED, MovementTypes.MANUAL_INTEREST_COLLECTED]
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
                      '$movementType', MovementTypes.CANCEL_INTEREST_COLLECTED
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
      .toArray()
  )
  
  return data
}
