/**
 * @typedef {import('../../../@types/dto/statistics/SystemTotalsDto').SystemTotalsDto} SystemTotalsDto
 * @typedef {import('../../../@types/dto/statistics/RefundReportDto').RefundReportDto} RefundReportDto
 */

const MovementTypes = require('../../../enums/MovementTypes')

/**
 * @this {typeof import('../Movement')}
 *
 * @param {any} filters
 *
 * @return {Promise<RefundReportDto[]>}
 */
module.exports.statisticsRefundReport = async function (filters = {}) {
  const secondMatch = { '$match': {} }
  
  if (filters.hasOwnProperty('fromClub')) {
    secondMatch.$match.fromClub = filters.fromClub
    
    delete filters.fromClub
  }
  
  /**
   * @type {RefundReportDto[]}
   */
  const data = await this.aggregateRaw([
        {
          '$match': {
            ...filters,
            'movementType': MovementTypes.DEPOSIT_REPAYMENT
          }
        }, {
          '$addFields': {
            'fromClub': {
              '$cond': {
                'if': {
                  '$or': [
                    // se movimento NON è fatto da un admin e
                    // se createdBy è null e
                    // se notes contiene "Rimborso ordine"
                    {
                      '$and': [
                        {
                          '$eq': [
                            '$createdByAdmin', false
                          ]
                        }, {
                          '$eq': [
                            '$createdBy', null
                          ]
                        }, {
                          '$regexFind': {
                            'input': '$notes',
                            'regex': new RegExp('(rimborso).*(ordine)'),
                            'options': 'i'
                          }
                        }
                      ]
                    },
                    // se movimento ha la proprietà app = 'club'
                    {
                      '$eq': [
                        '$app', 'club'
                      ]
                    }
                  ]
                },
                'then': true,
                'else': false
              }
            }
          }
        },
        secondMatch,
        {
          '$group': {
            '_id': {
              'userId': '$userId',
              'fromClub': '$fromClub'
            },
            'total': {
              '$sum': '$amountChange'
            }
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': '_id.userId',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            'preserveNullAndEmptyArrays': true
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
          '$group': {
            _id: '$_id.userId',
            user: {
              $first: '$user'
            },
            totalSum: {
              $sum: '$total'
            },
            totals: {
              $push: {
                'total': '$total',
                'fromClub': '$_id.fromClub'
              }
            }
          }
        }, {
          '$sort': {
            'totalSum': -1,
            'user.lastName': 1,
            'user.firstName': 1
          }
        }
      ])
  
  return data
}
