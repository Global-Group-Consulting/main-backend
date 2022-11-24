'use strict'

const { castToObjectId } = require('../Helpers/ModelFormatters')
const MongoModel = require('../../classes/MongoModel')

/** @type {typeof import('./Movement')} */
const Movement = use('App/Models/Movement')

const MovementTypes = require('../../Enums/MovementTypes')

class Statistic extends MongoModel {
  
  /**
   * Refresh the statistics of a user movement in the system
   * @param {string} userId
   * @param {[Date, Date]} dates
   */
  static async refreshMovementStatistics (userId, dates) {
    console.log(userId, dates)
    
    /**
     * User movements grouped by MovementType, year and month
     *
     * @type {{
     *   _id: {
     *     type: MovementType,
     *     month: number,
     *     year: number
     *   },
     *   total: number
     * }[]}
     */
    const movements = await this.aggregateRaw([
      {
        '$match': {
          'userId': castToObjectId(userId)
          /*'createdAt': {
            '$lte': dates[1],
          }*/
        }
      }, {
        '$addFields': {
          'month': {
            '$cond': {
              'if': {
                '$gte': [
                  {
                    '$dayOfMonth': '$created_at'
                  }, 16
                ]
              },
              'then': {
                '$month': '$created_at'
              },
              'else': {
                '$month': {
                  '$dateSubtract': {
                    'startDate': '$created_at',
                    'unit': 'month',
                    'amount': 1
                  }
                }
              }
            }
          },
          'year': {
            '$cond': {
              'if': {
                '$gte': [
                  {
                    '$dayOfMonth': '$created_at'
                  }, 16
                ]
              },
              'then': {
                '$year': '$created_at'
              },
              'else': {
                '$year': {
                  '$dateSubtract': {
                    'startDate': '$created_at',
                    'unit': 'year',
                    'amount': 1
                  }
                }
              }
            }
          }
        }
      }, {
        '$group': {
          '_id': {
            'type': '$movementType',
            'month': '$month',
            'year': '$year'
          },
          'total': {
            '$sum': '$amountChange'
          }
        }
      }, {
        '$sort': {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ], 'movements')
    
    const risultatoDesiderato = {
      userId: 'adsa87as8da',
      2019: {
        1: {
          deposit: 2121,
          interests: 2121,
          withdraw: 2121
        }
      }
    }
    
    let prevMonth = null
    
    // devo prendere tutti i movimenti dell'utente per calcolare le statistiche.
    // devo fare una calcolatrice che in base al tipo di movimento mi calcoli i vari dati
    return movements.reduce((acc, movement) => {
      const { _id: { type, month, year }, total } = movement
      const typeText = MovementTypes.get(type).id
      
      if (!acc[year]) {
        acc[year] = {}
      }
      
      if (!acc[year][month]) {
        acc[year][month] = {
          details: {},
          currInDeposit: 0,
          currInInterest: 0,
          currOutDeposit: 0,
          currOutInterest: 0,
          actualDeposit: 0,
          actualInterest: 0
        }
      }
      
      acc[year][month].details[typeText] = total
      
      acc[year][month].currInDeposit += MovementTypes.IN_DEPOSIT_TYPES.includes(type) ? total : 0
      acc[year][month].currInInterest += MovementTypes.IN_INTEREST_TYPES.includes(type) ? total : 0
      acc[year][month].currOutDeposit += MovementTypes.OUT_DEPOSIT_TYPES.includes(type) ? total : 0
      acc[year][month].currOutInterest += MovementTypes.OUT_INTEREST_TYPES.includes(type) ? total : 0
      acc[year][month].actualDeposit = prevMonth ? prevMonth.actualDeposit + (acc[year][month].currInDeposit - acc[year][month].currOutDeposit) : acc[year][month].currInDeposit - acc[year][month].currOutDeposit
      acc[year][month].actualInterest = prevMonth ? prevMonth.actualInterest + (acc[year][month].currInInterest - acc[year][month].currOutInterest) : acc[year][month].currInInterest - acc[year][month].currOutInterest
      
      prevMonth = acc[year][month]
      
      return acc
    }, {})
    
    return movements
  }
}

module.exports = Statistic
