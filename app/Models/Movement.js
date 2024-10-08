'use strict'

/** @typedef {typeof import('@adonisjs/lucid/src/Lucid/Model')} LucidModel*/
/** @typedef {import('../../@types/Movement.d').default} IMovement*/
/** @typedef {import('../../@types/User.d').User} IUser*/
/** @typedef {IMovement & Movement} MovementInstance */

const { Types: MongoTypes } = require('mongoose')
const { camelCase: _camelCase, upperFirst: _upperFirst } = require('lodash')

const MovementTypes = require('../../enums/MovementTypes')
const RequestTypes = require('../../enums/RequestTypes')
const InvalidMovementException = require('../Exceptions/InvalidMovementException')
const MovementErrorException = require('../Exceptions/MovementErrorException')

const { castToObjectId, castToIsoDate, castToNumber } = require('../Helpers/ModelFormatters')
const moment = require('moment')
const RequestStatus = require('../../enums/RequestStatus')

const { adminTotalsIn } = require('./Movement/adminTotalsIn')
const { adminTotalsOut } = require('./Movement/adminTotalsOut')
const { statisticsRefundReport } = require('./Movement/statisticsRefundReport')
const { withdrawalDepositReport } = require('./Movement/withdrawalDepositReport')
const { withdrawalInterestReport } = require('./Movement/withdrawalInterestReport')
const { filter } = require('./Movement/filter')
const { getReportsData } = require('./Movement/getReportsData')

const MongoModel = require('../../classes/MongoModel')

module.exports = class Movement extends MongoModel {

  static getAdminTotalsIn = adminTotalsIn
  static getAdminTotalsOut = adminTotalsOut
  static getStatisticsRefundReport = statisticsRefundReport
  static getWithdrawalDepositReport = withdrawalDepositReport
  static getWithdrawalInterestReport = withdrawalInterestReport
  static filter = filter
  static getReportsData = getReportsData

  static get computed () {
    return ['id']
  }

  static async boot () {
    super.boot()

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

        if (data.subtractDeposit) {
          lastMovement.deposit -= data.subtractDeposit
          lastMovement.depositOld -= data.subtractDeposit
        }

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
    data.amountChange = lastMovement.interestAmount >= 0 ? lastMovement.interestAmount : 0
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
  static async _handleInterestCollected(data, lastMovement, force = false) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException('The amount of the interest must be greater than 0.')
    }

    const amountChange = +data.amountChange.toFixed(2)
    const availableAmount = +lastMovement.interestAmount.toFixed(2)

    if (amountChange > availableAmount && !force) {
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
      interestPercentage: data.interestPercentage,
      app: data.app || 'main'
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
    const data = await this.aggregateRaw(aggregation)

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

  appendToHistory(updatedBy, fields, startedFrom) {
    if (!this.history) {
      this.history = []
    }

    this.history.push({
      updatedAt: new Date(),
      updatedBy,
      startedFrom,
      fields
    })

    return this
  }

  async user () {
    // return await UserModel.where({ "_id": this.userId }).first()
    return this.belongsTo('App/Models/User', 'userId', '_id')
  }

  async relativeUser () {
    return this.hasOne('App/Models/User', 'userId', '_id')
  }

  async request() {
    return this.belongsTo('App/Models/Request', 'requestId', '_id')
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

