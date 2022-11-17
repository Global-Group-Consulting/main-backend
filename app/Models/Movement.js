'use strict'

/** @typedef {typeof import('@adonisjs/lucid/src/Lucid/Model')} LucidModel*/
/** @typedef {import('../../@types/Movement.d').default} IMovement*/
/** @typedef {import('../../@types/User.d').User} IUser*/
/** @typedef {IMovement & Movement} MovementInstance */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

const { Types: MongoTypes } = require('mongoose')
const { camelCase: _camelCase, upperFirst: _upperFirst, filter } = require('lodash')

const MovementTypes = require('../../enums/MovementTypes')
const RequestTypes = require('../../enums/RequestTypes')
const InvalidMovementException = require('../Exceptions/InvalidMovementException')
const MovementErrorException = require('../Exceptions/MovementErrorException')

const { castToObjectId, castToIsoDate, castToNumber } = require('../Helpers/ModelFormatters')
const moment = require('moment')
const RequestStatus = require('../../enums/RequestStatus')

const { adminTotals } = require('./Movement/adminTotals')

/**
 * @class Movement
 */
class Movement extends Model {
  static db
  
  static getAdminTotals = adminTotals
  
  static get computed () {
    return ['id']
  }
  
  static async boot () {
    super.boot()
    
    this.db = await Database.connect('mongodb')
    
    this.addHook('beforeCreate',
      /** @param { MovementInstance } data */
      async (data) => {
        let user = null
        
        if (data.userId.constructor.name === 'User') {
          user = data.userId
          data.userId = user._id
        }
        
        const movementTypeId = MovementTypes.get(data.movementType).id
        /** @type {IMovement} */
        const lastMovement = await Movement.getLast(data.userId, data.created_at)
        const cancelType = [MovementTypes.CANCEL_COMMISSION_COLLECTED,
          MovementTypes.CANCEL_DEPOSIT_COLLECTED,
          MovementTypes.CANCEL_DEPOSIT_ADDED,
          MovementTypes.CANCEL_INTEREST_COLLECTED]
          .includes(data.movementType)
        
        if (cancelType) {
          const methodName = `_handle${_upperFirst(_camelCase(movementTypeId))}`
          
          if (await data.canCancel()) {
            await this[methodName](data, lastMovement)
          } else {
            throw new MovementErrorException('Can\'t cancel movement because has been already recapitalized.')
          }
          
          return
        }
        
        if (!data.interestPercentage) {
          throw new MovementErrorException('Missing interest percentage.')
        }
        
        data.depositOld = 0
        data.interestAmountOld = 0
        
        // if doesn't exist a last movement, then must be created an initial deposit.
        if (!lastMovement) {
          await this._handleInitialDeposit(data)
        } else if (data.movementType === MovementTypes.INITIAL_DEPOSIT) {
          throw new InvalidMovementException('Exists already an initial deposit.')
        } else {
          const methodName = `_handle${_upperFirst(_camelCase(movementTypeId))}`
          
          data.depositOld = lastMovement.deposit
          data.interestAmountOld = lastMovement.interestAmount
          
          await this[methodName](data, lastMovement)
        }
      })
  }
  
  /**
   * @param {MovementInstance} data
   */
  static async _handleInitialDeposit (data) {
    if (data.movementType !== MovementTypes.INITIAL_DEPOSIT) {
      throw new InvalidMovementException('First must be added an initial deposit.')
    } else if (data.amountChange === 0) {
      // throw new InvalidMovementException("The initial deposit can't be 0.")
    }
    
    data.deposit = data.amountChange
    data.interestAmount = 0
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleDepositAdded (data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException('The amount of the deposit must be greater than 0')
    }
    
    data.deposit = lastMovement.deposit + data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleInterestRecapitalized (data, lastMovement) {
    data.amountChange = lastMovement.interestAmount
    data.deposit = lastMovement.deposit + lastMovement.interestAmount
    data.interestAmount = data.deposit * (data.interestPercentage / 100)
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleCommissionsReinvestment (data, lastMovement) {
    data.deposit = lastMovement.deposit + data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleInterestCollected (data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException('The amount of the interest must be greater than 0.')
    }
    
    const amountChange = +data.amountChange.toFixed(2)
    const availableAmount = +lastMovement.interestAmount.toFixed(2)
    
    if (amountChange > availableAmount) {
      throw new InvalidMovementException('Can\'t collect more then the available interest.')
    } else if (amountChange === availableAmount) {
      data.amountChange = lastMovement.interestAmount
    }
    
    data.deposit = lastMovement.deposit
    data.interestAmount = lastMovement.interestAmount - data.amountChange
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleDepositCollected (data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException('The amount of the deposit must be greater than 0.')
    }
    
    const amountChange = +data.amountChange.toFixed(2)
    const availableAmount = +lastMovement.deposit.toFixed(2)
    
    if (amountChange > availableAmount) {
      throw new InvalidMovementException('Can\'t collect more then the available deposit.')
    }
    
    data.deposit = lastMovement.deposit - data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleCancelInterestCollected (data, lastMovement) {
    data.deposit = lastMovement.deposit
    data.interestAmount = lastMovement.interestAmount + data.amountChange
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleCancelDepositCollected (data, lastMovement) {
    data.deposit = lastMovement.deposit + data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleCancelDepositAdded (data, lastMovement) {
    data.deposit = lastMovement.deposit - data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleManualInterestCollected (data, lastMovement) {
    data.deposit = lastMovement.deposit
    data.interestAmount = lastMovement.interestAmount - data.amountChange
  }
  
  /**
   * @param {MovementInstance} data
   * @param {MovementInstance} lastMovement
   */
  static async _handleDepositRepayment (data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException('The amount of the deposit must be greater than 0')
    }
    
    data.deposit = lastMovement.deposit + data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }
  
  /**
   *
   * @param {{userId: string, notes: string, amount: number, interestPercentage: number, createdByAdmin: boolean, requestType?: number, createdBy?: string}} data
   * @returns {Promise<Movement>}
   */
  static async addRepaymentMovement (data) {
    /** @type {IMovement} */
    const newMovement = {
      userId: castToObjectId(data.userId),
      amountChange: data.amount,
      movementType: MovementTypes.DEPOSIT_REPAYMENT,
      notes: data.notes,
      createdByAdmin: data.createdByAdmin || false,
      createdBy: data.createdBy,
      requestType: data.requestType,
      interestPercentage: data.interestPercentage
    }
    
    return Movement.create(newMovement)
  }
  
  static async getInitialInvestment (id) {
    const result = await Movement.where({ userId: id, movementType: MovementTypes.INITIAL_DEPOSIT }).first()
    
    return result
  }
  
  /**
   * @param {string | ObjectId} userId
   * @returns {IMovement}
   */
  static async getLastRecapitalization (userId) {
    if (typeof userId === 'string') {
      userId = new MongoTypes.ObjectId(userId)
    }
    
    return await Movement.where({
      movementType: MovementTypes.INTEREST_RECAPITALIZED,
      userId
    }).sort({ created_at: -1 }).first()
  }
  
  static async getPastRecapitalizations (userId) {
    if (typeof userId === 'string') {
      userId = new MongoTypes.ObjectId(userId)
    }
    
    const data = await Movement.where({
      movementType: MovementTypes.INTEREST_RECAPITALIZED,
      userId
    }).sort({ created_at: -1 }).fetch()
    
    return data.rows
  }
  
  /**
   *
   * @param {string} id
   * @param {string} maxDate
   * @returns {IMovement}
   */
  static async getLast (id, maxDate = null) {
    if (typeof id === 'string') {
      id = new MongoTypes.ObjectId(id)
    }
    
    const query = { userId: castToObjectId(id) }
    
    if (maxDate) {
      query.created_at = { $lte: maxDate }
    }
    
    return await Movement.where(query).sort({ 'created_at': -1 }).first()
  }
  
  static async getAll (id) {
    if (typeof id === 'string') {
      id = new MongoTypes.ObjectId(id)
    }
    
    return await Movement.where({ userId: id }).sort({ 'created_at': -1 }).fetch()
  }
  
  static async getMonthMovements (id) {
    if (typeof id === 'string') {
      id = new MongoTypes.ObjectId(id)
    }
    let minDate = null
    
    const lastRecapitalization = await Movement.getLastRecapitalization(id)
    
    if (!lastRecapitalization) {
      const initialInvestment = await Movement.getInitialInvestment(id)
      
      minDate = initialInvestment ? initialInvestment.created_at : new Date()
    } else {
      minDate = lastRecapitalization.created_at
    }
    
    const movements = await Movement.where({ userId: id, 'created_at': { $gt: minDate } }).fetch()
    
    const toReturn = {
      depositCollected: 0,
      interestsCollected: 0
    }
    
    for (const movement of movements.toJSON()) {
      
      switch (+movement.movementType) {
        case MovementTypes.DEPOSIT_COLLECTED:
          toReturn.depositCollected += movement.amountChange
          
          break
        case MovementTypes.CANCEL_DEPOSIT_COLLECTED:
          toReturn.depositCollected -= movement.amountChange
          
          break
        case MovementTypes.INTEREST_COLLECTED:
          toReturn.interestsCollected += movement.amountChange
          
          break
        case MovementTypes.CANCEL_INTEREST_COLLECTED:
          toReturn.interestsCollected -= movement.amountChange
          
          break
      }
    }
    
    return toReturn
  }
  
  /**
   *
   * @param {{type: 'withdrawals' | 'commissions', startDate: string, endDate: string, movementType?: number, user?: IUser, referenceAgent?: IUser}} filters
   * @return {Promise<*>}
   */
  static async getReportsData (filters) {
    /*
    il report deve contenere 3 tab
    - Riscossione provvigioni
      - dal 1 al 30 del mese precedente (quelle riscosse che non sono state bloccate il 1)
    - Riscossioni rendite classic
      - Riscossione degli interessi maturati dal 16 al 15
    - Riscossione rendite gold
      - Riscossione degli interessi maturati dal 16 al 15
      - Inserire sia gold che brite (aggiuhngere colonna che mostra uno o l'altro)
      - In fase di download, se una richiesta è classic, ma l'utente è gold, inserire quella richiesta nella pagina relativa ai gold.


    Il giorno 16, mandare agli admin un email che li invita a scaricare il report del mese con i versamenti da effettuare.


    Aggiungere le seguenti colonne:
    Importo
    Tipo richiesta (nome + gold o fisico)
    Nome Cognome
    IBAN
    BIC
    Note
    Agente riferimento
     */
    
    let startDate = null
    let endDate = null
    const type = filters.type
    const movementsToSearch = (filters.movementType) ? [filters.movementType] : [MovementTypes.DEPOSIT_COLLECTED, MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.INTEREST_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED]
    const momentDate = moment()
    
    // quando l'utente richiede una tipologia, devo anche includere i movimenti di annullamento di quella tipologia.
    if (filters.movementType) {
      switch (filters.movementType) {
        case MovementTypes.DEPOSIT_COLLECTED:
          movementsToSearch.push(MovementTypes.CANCEL_DEPOSIT_COLLECTED)
          break
        case MovementTypes.INTEREST_COLLECTED:
          movementsToSearch.push(MovementTypes.CANCEL_INTEREST_COLLECTED)
          break
      }
    }
    
    startDate = moment(momentDate).subtract(1, 'months').set({
      date: type === 'withdrawals' ? 16 : 1,
      hour: 0,
      minute: 0,
      second: 0
    })
    endDate = moment(momentDate).set({
      date: type === 'withdrawals' ? 15 : 1,
      hour: 23,
      minute: 59,
      second: 59
    })
    
    if (type === 'commissions') {
      endDate = endDate.subtract(1, 'days')
    }
    
    if (filters.startDate) {
      startDate = moment(filters.startDate)
    }
    
    if (filters.endDate) {
      endDate = moment(filters.endDate)
    }
    
    const query = {
      movementType: { $in: movementsToSearch },
      created_at: {
        $gte: startDate.toDate(),
        $lte: endDate.set({
          hour: 23,
          minute: 59,
          second: 59
        }).toDate()
      }
    }
    
    if (filters.user) {
      query.userId = castToObjectId(filters.user)
    }
    
    if (filters.referenceAgent) {
      query['user.referenceAgent'] = castToObjectId(filters.referenceAgent)
    }
    
    if (filters.clubPack) {
      if (filters.clubPack === 'unsubscribed') {
        query['$or'] = [
          {
            'user.clubPack': { '$eq': null }
          },
          {
            'user.clubPack': { '$exists': false }
          },
          {
            'user.clubPack': { '$eq': 'unsubscribed' }
          }
        ]
      } else {
        query['$and'] = [
          {
            'user.clubPack': { '$exists': true }
          }, {
            'user.clubPack': { '$ne': 'unsubscribed' }
          }
        ]
      }
    }
    
    const joinUserWithRefAgent = [
      {
        '$lookup': {
          'from': 'users',
          'let': {
            'userId': '$userId'
          },
          'as': 'user',
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': ['$_id', '$$userId']
                }
              }
            },
            {
              '$addFields': {
                'id': '$_id'
              }
            },
            {
              '$project': {
                '_id': 0,
                'id': 1,
                'firstName': 1,
                'lastName': 1,
                'email': 1,
                'contractNumber': 1,
                'contractNotes': 1,
                'contractIban': 1,
                'referenceAgent': 1,
                'clubPack': 1,
                'gold': 1
              }
            },
            {
              '$lookup': {
                'from': 'users',
                'let': {
                  'agentId': '$referenceAgent'
                },
                'as': 'referenceAgentData',
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$_id', '$$agentId'
                        ]
                      }
                    }
                  },
                  {
                    '$addFields': {
                      'id': '$_id'
                    }
                  },
                  {
                    '$project': {
                      'id': 1,
                      '_id': 0,
                      'firstName': 1,
                      'lastName': 1,
                      'email': 1
                    }
                  }
                ]
              }
            },
            {
              '$unwind': {
                'path': '$referenceAgentData',
                'preserveNullAndEmptyArrays': true
              }
            }
          ]
        }
      },
      {
        '$unwind': {
          'path': '$user'
        }
      }
    ]
    const joinRequest = [
      {
        '$lookup': {
          'from': 'requests',
          'let': {
            'movementId': '$_id'
          },
          'as': 'request',
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': ['$movementId', '$$movementId']
                }
              }
            },
            {
              '$addFields': {
                'id': '$_id'
              }
            }
          ]
        }
      },
      {
        '$unwind': {
          'path': '$request',
          'preserveNullAndEmptyArrays': true
        }
      }
    ]
    
    const data = await this.db.collection('movements')
      .aggregate([
        {
          '$sort': {
            created_at: -1
          }
        },
        ...joinUserWithRefAgent,
        {
          '$match': query
        },
        ...joinRequest,
        {
          '$group': {
            '_id': {
              'user': '$userId',
              'requestType': '$request.type',
              'movementType': '$movementType'
            },
            'movements': {
              '$push': '$$ROOT'
            },
            'amount': {
              '$sum': '$amountChange'
            },
            user: {
              $addToSet: '$user'
            },
            reqNotes: {
              $push: '$request.notes'
            }
          }
        },
        {
          '$unwind': {
            'path': '$user'
          }
        },
        {
          '$addFields': {
            'created_at': {
              '$arrayElemAt': ['$movements.created_at', 0]
            }
          }
        },
        {
          '$addFields': {
            'type': filters.type
          }
        },
        {
          '$sort': {
            'user.lastName': 1,
            'user.firstName': 1,
            '_id.requestType': 1
          }
        }
      ]).toArray()
    
    /**
     * @type {{_id: string, users: any[]}[]}
     */
    const jsonData = data //data.toJSON()
    const toReturn = {}
    
    // Must check cancelled movements
    
    const cancellationMovements = jsonData.filter(entry => [MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED].includes(entry._id.movementType))
    const normalMovements = jsonData.filter(entry => ![MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED].includes(entry._id.movementType))
    
    const toCancel = []
    
    // check the movements that have been cancelled
    for (const entry of cancellationMovements) {
      entry.movements.forEach(cancelMovement => {
        if (cancelMovement.cancelRef) {
          const cancelRef = cancelMovement.cancelRef.toString()
          
          toCancel.push(cancelRef)
        }
      })
    }
    
    // Remove the movements that has been cancelled
    normalMovements.map(entry => {
      entry.movements = entry.movements.filter((movement, i) => {
        const movementId = movement._id.toString()
        const mustReturn = !toCancel.includes(movementId)
        
        if (!mustReturn) {
          entry.amount -= movement.amountChange
        }
        
        return mustReturn
      })
      
      return entry
    })
    
    // Return only groups that has an amount greater than 0
    return normalMovements
      .filter(entry => entry.amount > 0)
      .filter(entry => {
        let mustReturn = true
        
        if (filters.amountRange) {
          const amountMin = filters.amountRange.min
          const amountMax = filters.amountRange.max
          
          const amountFilter = {
            min: true,
            max: true
          }
          
          if (amountMin) {
            amountFilter['min'] = entry.amount >= +amountMin
          }
          if (amountMax) {
            amountFilter['max'] = entry.amount <= +amountMax
          }
          
          mustReturn = amountFilter.min && amountFilter.max
        }
        
        return mustReturn
      })
  }
  
  static async getMovementsReportData (userId) {
    const date = new Date()
    
    // last 30 months
    date.setMonth(date.getMonth() - 30)
    
    const aggregation = [
      {
        '$match': {
          'userId': castToObjectId(userId),
          'created_at': {
            '$gte': date
          }
        }
      }, {
        '$addFields': {
          'month_year': {
            '$concat': [
              {
                '$toString': {
                  '$year': '$created_at'
                }
              }, '_', {
                '$toString': {
                  '$month': '$created_at'
                }
              }
            ]
          },
          'month': {
            '$month': '$created_at'
          },
          'year': {
            '$year': '$created_at'
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
     * @type {Movement[]}
     */
    const data = await this.db.collection('movements').aggregate(aggregation).toArray()
    
    return data.map((entry, i) => {
      entry.newDeposit = 0
      entry.deposit = 0
      entry.depositWithdrawn = 0
      entry.interests = 0
      entry.interestsRecapitalized = 0
      entry.interestsWithdrawn = 0
      entry.britesRecapitalized = 0
      entry.brites = 0
      
      entry.movements.forEach(movement => {
        switch (movement.movementType) {
          case MovementTypes.INITIAL_DEPOSIT:
          case MovementTypes.DEPOSIT_ADDED:
          case MovementTypes.DEPOSIT_REPAYMENT:
            entry.newDeposit += movement.amountChange
            break
          case MovementTypes.INTEREST_RECAPITALIZED:
            entry.interestsRecapitalized += movement.amountChange
            entry.interests += movement.interestAmount
            entry.deposit += movement.deposit
            break
          case MovementTypes.INTEREST_COLLECTED:
            entry.interestsWithdrawn += movement.amountChange
            break
          case MovementTypes.DEPOSIT_COLLECTED:
            entry.depositWithdrawn += movement.amountChange
            break
        }
      })
      
      //If deposit is 0, then is the current month so we must wait for the recapitalization
      // if (!entry.deposit && i === 0) {
      // entry.deposit = entry.movements[0].deposit
      // }
      
      return entry
    })
  }
  
  async user () {
    // return await UserModel.where({ "_id": this.userId }).first()
    return this.belongsTo('App/Models/User', 'userId', '_id')
  }
  
  async relativeUser () {
    return this.hasOne('App/Models/User', 'userId', '_id')
  }
  
  async canCancel () {
    const lastRecapitalization = await Movement.where({
      movementType: MovementTypes.INTEREST_RECAPITALIZED,
      created_at: { $gt: this.created_at }
    })
      .sort({ created_at: -1 }).first()
    
    return !lastRecapitalization
  }
  
  getId () {
    return this._id.toString()
  }
  
  setAmountChange (value) {
    return castToNumber(value)
  }
  
  setRequestType (value) {
    return castToNumber(value)
  }
  
  setUserId (value) {
    return castToObjectId(value)
  }
  
  setCancelRef (value) {
    return castToObjectId(value)
  }
  
  setPaymentDocDate (value) {
    return castToIsoDate(value)
  }
  
}

module.exports = Movement
