'use strict'

/** @typedef {typeof import('@adonisjs/lucid/src/Lucid/Model')} LucidModel*/
/** @typedef {import('../../@types/Movement.d').default} IMovement*/
/** @typedef {import('../../@types/User.d').User} IUser*/
/** @typedef {IMovement & Movement} MovementInstance */

/** @type {LucidModel} */
const Model = use('Model')

const { Types: MongoTypes } = require('mongoose');
const { camelCase: _camelCase, upperFirst: _upperFirst } = require("lodash")

const MovementTypes = require("../../enums/MovementTypes")
const InvalidMovementException = require("../Exceptions/InvalidMovementException")
const MovementErrorException = require("../Exceptions/MovementErrorException")

const { castToObjectId } = require("../Helpers/ModelFormatters")

class Movement extends Model {
  static boot() {
    super.boot()

    this.addHook("beforeCreate",
      /** @param { MovementInstance } data */
      async (data) => {
        let user = null

        if (data.userId.constructor.name === "User") {
          user = data.userId
          data.userId = user._id
        }

        const movementTypeId = MovementTypes.get(data.movementType).id
        /** @type {IMovement} */
        const lastMovement = await Movement.getLast(data.userId)
        const cancelType = [MovementTypes.CANCEL_COMMISSION_COLLECTED, MovementTypes.CANCEL_DEPOSIT_COLLECTED, MovementTypes.CANCEL_INTEREST_COLLECTED]
          .includes(data.movementType)

        if (cancelType) {
          const methodName = `_handle${_upperFirst(_camelCase(movementTypeId))}`

          if (await data.canCancel()) {
            await this[methodName](data, lastMovement)
          } else {
            throw new MovementErrorException("Can't cancel movement because has been already recapitalized.")
          }

          return
        }

        if (!data.interestPercentage) {
          throw new MovementErrorException("Missing interest percentage.")
        }

        data.depositOld = 0
        data.interestAmountOld = 0

        // if doesn't exist a last movement, then must be created an initial deposit.
        if (!lastMovement) {
          await this._handleInitialDeposit(data)
        } else if (data.movementType === MovementTypes.INITIAL_DEPOSIT) {
          throw new InvalidMovementException("Exists already an initial deposit.")
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
  static async _handleInitialDeposit(data) {
    if (data.movementType !== MovementTypes.INITIAL_DEPOSIT) {
      throw new InvalidMovementException("First must be added an initial deposit.")
    } else if (data.amountChange === 0) {
      throw new InvalidMovementException("The initial deposit can't be 0.")
    }

    data.deposit = data.amountChange
    data.interestAmount = 0
  }

  /**
   * @param {MovementInstance} data 
   * @param {MovementInstance} lastMovement 
   */
  static async _handleDepositAdded(data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException("The amount of the deposit must be greater than 0")
    }

    data.deposit = lastMovement.deposit + data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }

  /**
   * @param {MovementInstance} data 
   * @param {MovementInstance} lastMovement 
   */
  static async _handleInterestRecapitalized(data, lastMovement) {
    data.amountChange = lastMovement.interestAmount
    data.deposit = lastMovement.deposit + lastMovement.interestAmount
    data.interestAmount = data.deposit * (data.interestPercentage / 100)
  }

  /**
   * @param {MovementInstance} data 
   * @param {MovementInstance} lastMovement 
   */
  static async _handleInterestCollected(data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException("The amount of the interest must be greater than 0.")
    }

    if (data.amountChange > lastMovement.interestAmount) {
      throw new InvalidMovementException("Can't collect more then the available interest.")
    }

    data.deposit = lastMovement.deposit
    data.interestAmount = lastMovement.interestAmount - data.amountChange
  }

  /**
   * @param {MovementInstance} data 
   * @param {MovementInstance} lastMovement 
   */
  static async _handleDepositCollected(data, lastMovement) {
    if (data.amountChange <= 0) {
      throw new InvalidMovementException("The amount of the deposit must be greater than 0.")
    }

    if (data.amountChange > lastMovement.deposit) {
      throw new InvalidMovementException("Can't collect more then the available deposit.")
    }

    data.deposit = lastMovement.deposit - data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }

  /**
   * @param {MovementInstance} data 
   * @param {MovementInstance} lastMovement 
   */
  static async _handleCancelInterestCollected(data, lastMovement) {
    data.deposit = lastMovement.deposit
    data.interestAmount = lastMovement.interestAmount + data.amountChange
  }

  /**
   * @param {MovementInstance} data 
   * @param {MovementInstance} lastMovement 
   */
  static async _handleCancelDepositCollected(data, lastMovement) {
    data.deposit = lastMovement.deposit + data.amountChange
    data.interestAmount = lastMovement.interestAmount
  }

  static async getInitialInvestment(id) {
    const result = await Movement.where({ userId: id, movementType: MovementTypes.INITIAL_DEPOSIT }).first()

    return result
  }

  /**
   * @param {string | ObjectId} userId 
   * @returns {IMovement}
   */
  static async getLastRecapitalization(userId) {
    if (typeof userId === "string") {
      userId = new MongoTypes.ObjectId(userId)
    }

    return await Movement.where({ movementType: MovementTypes.INTEREST_RECAPITALIZED, userId }).sort({ created_at: -1 }).first()
  }

  static async getPastRecapitalizations(userId) {
    if (typeof userId === "string") {
      userId = new MongoTypes.ObjectId(userId)
    }

    const data = await Movement.where({ movementType: MovementTypes.INTEREST_RECAPITALIZED, userId }).sort({ created_at: -1 }).fetch()

    return data.rows
  }

  /**
   * 
   * @param {} id 
   * @returns {IMovement}
   */
  static async getLast(id) {
    if (typeof id === "string") {
      id = new MongoTypes.ObjectId(id)
    }

    return await Movement.where({ userId: id }).sort({ "created_at": -1 }).first()
  }

  static async getAll(id) {
    if (typeof id === "string") {
      id = new MongoTypes.ObjectId(id)
    }

    return await Movement.where({ userId: id }).sort({ "created_at": -1 }).fetch()
  }

  static async getMonthMovements(id) {
    if (typeof id === "string") {
      id = new MongoTypes.ObjectId(id)
    }
    let minDate = null

    const lastRecapitalization = await Movement.getLastRecapitalization(id)

    if (!lastRecapitalization) {
      const initialInvestment = await Movement.getInitialInvestment(id)

      minDate = initialInvestment.created_at
    } else {
      minDate = lastRecapitalization.created_at
    }

    const movements = await Movement.where({ userId: id, "created_at": { $gt: minDate } }).fetch()

    const toReturn = {
      depositCollected: 0,
      interestsCollected: 0,
    }

    for (const movement of movements.toJSON()) {

      switch (+movement.movementType) {
        case MovementTypes.DEPOSIT_COLLECTED:
          toReturn.depositCollected += movement.amountChange

          break;
        case MovementTypes.CANCEL_DEPOSIT_COLLECTED:
          toReturn.depositCollected -= movement.amountChange

          break;
        case MovementTypes.INTEREST_COLLECTED:
          toReturn.interestsCollected += movement.amountChange

          break;
        case MovementTypes.CANCEL_INTEREST_COLLECTED:
          toReturn.interestsCollected -= movement.amountChange

          break;
      }
    }

    return toReturn
  }


  async user() {
    // return await UserModel.where({ "_id": this.userId }).first()
    return this.belongsTo('App/Models/User', "userId", "_id")
  }

  async canCancel() {
    const lastRecapitalization = await Movement.where({ movementType: MovementTypes.INTEREST_RECAPITALIZED, created_at: { $gt: this.created_at } })
      .sort({ created_at: -1 }).first()

    return !lastRecapitalization
  }


  setUserId(value) {
    return castToObjectId(value)
  }

  setCancelRef(value) {
    return castToObjectId(value)
  }
}

module.exports = Movement
