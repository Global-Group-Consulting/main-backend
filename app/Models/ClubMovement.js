'use strict'

const { castToObjectId } = require('../Helpers/ModelFormatters')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

const BriteMovementTypes = require('../../enums/BriteMovementTypes')

/**
 * @property {string} clubPack
 * @property {import('../../@types/club/movement.type.enum').MovementTypeEnum} movementType
 * @property {string} semesterId
 * @property {string} userId
 * @property {number} amountChange
 * @property {string} expiresAt
 * @property {string} usableFrom
 * @property {string} referenceSemester
 * @property {string} createdAt
 * @property {string} updatedAt
 */
class ClubMovement extends Model {
  static db
  
  static get connection () { return 'mongoClub' }
  
  static get collection () { return 'movements' }
  
  static async boot () {
    super.boot()
    
    // this.db = await Database.connect(this.connection)
  }
  
  static async getMovementsReportData (userId) {
    const date = new Date()
    
    this.db = await Database.connection(this.connection).connect()
    
    // last 30 months
    date.setMonth(date.getMonth() - 30)
    
    const aggregation = [
      {
        '$match': {
          'userId': castToObjectId(userId),
          'createdAt': {
            '$gte': date
          }
        }
      }, {
        '$addFields': {
          'month_year': {
            '$concat': [
              {
                '$toString': {
                  '$year': '$createdAt'
                }
              }, '_', {
                '$toString': {
                  '$month': '$createdAt'
                }
              }
            ]
          },
          'month': {
            '$month': '$createdAt'
          },
          'year': {
            '$year': '$createdAt'
          }
        }
      }, {
        '$group': {
          '_id': {
            'date': '$month_year',
            'month': '$month',
            'year': '$year'
          },
          'movements': {
            '$push': '$$ROOT'
          },
          'count': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          '_id.year': -1,
          '_id.month': -1
        }
      }
    ]
    
    /**
     * @type {{_id: {}, movements: ClubMovement[]}[]}
     */
    const data = await this.db.collection('movements').aggregate(aggregation).toArray()
    const toReturn = []
    
    for (let i = data.length - 1; i >= 0; i--) {
      const entry = data[i]
      const prevEntry = toReturn[0]
      
      entry.newBritesDeposit = 0
      entry.brites = 0
      entry.britesWithdrawn = 0
      entry.britesRecapitalized = 0
      entry.movements.forEach(movement => {
        switch (movement.movementType) {
          case BriteMovementTypes.DEPOSIT_ADDED:
            entry.newBritesDeposit += movement.amountChange
            break
          case BriteMovementTypes.INTEREST_RECAPITALIZED:
            entry.britesRecapitalized += movement.amountChange
            break
          case BriteMovementTypes.DEPOSIT_TRANSFERED:
          case BriteMovementTypes.DEPOSIT_USED:
          case BriteMovementTypes.DEPOSIT_REMOVED:
            entry.britesWithdrawn += movement.amountChange
            break
        }
      })
      
      if (prevEntry) {
        entry.brites = prevEntry.brites + prevEntry.britesRecapitalized + prevEntry.newBritesDeposit - prevEntry.britesWithdrawn
      }
      
      toReturn.unshift(entry)
    }
    
    return toReturn
  }
}

module.exports = ClubMovement
