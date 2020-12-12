'use strict'

/** @typedef {import("../../@types/Movement.d").default} Movement */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {typeof import('./Setting')} */
const SettingModel = use('App/Models/Setting')

/** @type {typeof import('./Movement')} */
const MovementModel = use("App/Models/Movement")

/** @type {typeof import('./User')} */
const UserModel = use("App/Models/User")

/** @type {typeof import('../Exceptions/CommissionException')} */
const CommissionException = use("App/Exceptions/CommissionException")

const {castToObjectId} = require("../Helpers/ModelFormatters")
const CommissionType = require("../../enums/CommissionType")
const MovementTypes = require("../../enums/MovementTypes")
const moment = require("moment")

class Commission extends Model {
  static async fetchAll() {
    return this.all()
  }

  /**
   *
   * @param movementId
   * @returns {Promise<{agent: *, movement: Movement, user: *}>}
   * @private
   */
  static async _getMovementRelatedDate(movementId) {
    // get movement
    const movement = await MovementModel.where({"_id": castToObjectId(movementId)}).first()

    if (!movement) {
      throw new CommissionException("Can't find any movement with the specified id")
    }

    // Get the user related to that movement
    const user = await UserModel.query().where("_id", movement.userId).with("referenceAgentData").first()

    if (!user) {
      throw new CommissionException("Can't find the user related with the specified movement")
    }

    // get the user's agent
    const agent = await user.referenceAgentData().first()

    if (!agent) {
      throw new CommissionException("The user associated with the movement doesn't have a reference agent")
    }

    return {movement, user, agent}
  }

  static async _getLastCommission(userId) {
    return this.where({userId: castToObjectId(userId)}).sort({created_at: -1}).first()
  }

  static async _getCommissionsToReinvest(userId) {
    const commission = await this.where({
      userId: castToObjectId(userId),
      commissionType: CommissionType.COMMISSIONS_TO_REINVEST
    })
      .sort({created_at: -1}).first()

    if (commission && commission.processed) {
      return null
    }

    return commission
  }

  static async _getLastReinvestment(userId) {
    return this.where({
      userId: castToObjectId(userId),
      commissionType: CommissionType.COMMISSIONS_REINVESTMENT
    })
      .sort({created_at: -1}).first()
  }

  static _getMomentDate(date) {
    return moment().set({
      'date': date || 1,
      'hour': 0,
      "minute": 0,
      "second": 0,
      "millisecond": 0
    })
  }

  static _getMonthCollections(userId) {
    userId = castToObjectId(userId)

    const lastReinvestment = this._getLastReinvestment(userId)
    const startFromDate = lastReinvestment ? lastReinvestment.created_at : this._getMomentDate()
    // const collectMovements = this.where({userId, created_at: })
  }

  /**
   *
   * @param {{
   *   movementId: string,
   *   userId: string,
   *   clientId: string,
   *   commissionType: CommissionType,
   *   dateReference: Date,
   *   amountChange: number,
   *   commissionOnValue: number,
   *   commissionPercentage: number
   * }} data
   * @param lastCommission
   * @private
   */
  static _create(data, lastCommission) {
    if (!lastCommission) {
      lastCommission = {}
    }

    const dataToCreate = {
      ...data,
      currMonthCommissions: (lastCommission.currMonthCommissions || 0),
      currMonthCommissionsOld: lastCommission.currMonthCommissions || 0,
    }

    switch (data.commissionType) {
      case CommissionType.ANNUAL_DEPOSIT:
      case CommissionType.NEW_DEPOSIT:
      case CommissionType.TOTAL_DEPOSIT:
        dataToCreate.currMonthCommissions += data.amountChange

        break
      case CommissionType.COMMISSIONS_TO_REINVEST:
      case CommissionType.COMMISSIONS_COLLECTED:
        dataToCreate.currMonthCommissions -= dataToCreate.amountChange

        break;
    }

    return Commission.create(dataToCreate)
  }

  /**
   * Check if the user has the specified type of commission active, otherwise won't do nothing.
   *
   * @param agent
   * @param requiredType
   * @private
   */
  static _checkAgentActiveCommission(agent, requiredType) {
    // get the agent active commissions
    const agentCommissions = agent.commissionsAssigned ? agent.commissionsAssigned.map(_obj => JSON.parse(_obj)) : null

    /** @type {{name: CommissionType, percent: number}} */
    const currentCommissionSettings = agentCommissions.find(_entry => _entry.name === requiredType)

    if (!agentCommissions || !currentCommissionSettings) {
      throw new CommissionException("This type of commission is not activated for this agent.")
    }

    return currentCommissionSettings
  }

  /**
   * Commission that occurs each time a client of an agent invest new money
   * @returns {Promise<void>}
   */
  static async addNewDepositCommission(movementId) {
    const {movement, agent, user} = await this._getMovementRelatedDate(movementId)

    // Check if the user has the specified type of commission active, otherwise won't do nothing.
    const currentCommissionSettings = await this._checkAgentActiveCommission(agent, CommissionType.NEW_DEPOSIT)

    // get the user new deposit
    const newDeposit = movement.amountChange

    // calc the percentage based on the new deposit
    const agentCommissionPercentage = currentCommissionSettings.percent
    const commissionValue = (agentCommissionPercentage * newDeposit) / 100

    // get the date specified for the deposit (specified by admin when confirming a new deposit. This is the date when the money fiscally arrived in our bank account)
    const dateOfCommission = moment(movement.paymentDocDate).toDate()

    const lastCommission = await this._getLastCommission(agent._id)

    // create the movement in the database
    // use that date as the date of the commission movement, so that when reinvesting it, will figure in the right month.
    const newCommissionMovement = await this._create({
      movementId: movementId,
      userId: agent._id,
      clientId: user._id,
      commissionType: CommissionType.NEW_DEPOSIT,
      dateReference: moment(dateOfCommission).toDate(),
      amountChange: commissionValue,
      commissionOnValue: newDeposit,
      commissionPercentage: agentCommissionPercentage,
    }, lastCommission)

    return newCommissionMovement
  }

  /**
   * Commission that'll be calculated based on clients last month deposit after recapitalizazion occurs.
   * @returns {Promise<void>}
   */
  static async addExistingDepositCommission(movementId) {
    const {movement, agent, user} = await this._getMovementRelatedDate(movementId)

    if (movement.interestPercentage >= 4) {
      throw new CommissionException("The user percentage is higher that 4, so there is nothing left for the agent.")
    }

    // Check if the user has the specified type of commission active, otherwise won't do nothing.
    await this._checkAgentActiveCommission(agent, CommissionType.TOTAL_DEPOSIT)

    // calc the diff between 4 and the client's percentage.
    const agentLeftPercentage = 4 - movement.interestPercentage

    // with the given percentage calc the value based on the user deposit
    const commissionValue = agentLeftPercentage * movement.deposit / 100

    const lastCommission = await this._getLastCommission(agent._id)

    // create the movement in the database
    const newCommissionMovement = await this._create({
      movementId: movementId,
      userId: agent._id,
      clientId: user._id,
      commissionType: CommissionType.TOTAL_DEPOSIT,
      dateReference: moment(movement.created_at).toDate(),
      amountChange: commissionValue,
      commissionOnValue: movement.deposit,
      commissionOnPercentage: movement.interestPercentage,
      commissionPercentage: agentLeftPercentage,
    }, lastCommission)

    return newCommissionMovement
  }

  /**
   * Commission that occurs yearly, based on the previous clients deposit.
   * This will calculate 6% of the clients deposit and split in in 3 months, april, august, december
   * @returns {Promise<void>}
   */
  static async addAnnualCommission() {
    // TBD
  }

  /**
   * Once the month ends, i must block the earned commissions, waiting for the reinvestment that will happen
   * in a future date.
   *
   * @returns {Promise<void>}
   */
  static async blockCommissionsToReinvest(userId) {
    const agent = await UserModel.find(userId)

    if (!agent) {
      throw new CommissionException("No agent was found for the provided id.")
    }

    const lastCommission = await this._getLastCommission(agent._id)

    if (!lastCommission) {
      throw new CommissionException("Can't find the last commission movement, so no reinvestment will be added.")
    }

    // get the amount that need to be reinvested
    const reinvestmentAmount = lastCommission.currMonthCommissions

    const newCommissionMovement = await this._create({
      userId: agent._id,
      commissionType: CommissionType.COMMISSIONS_TO_REINVEST,
      amountChange: reinvestmentAmount
    }, lastCommission)

    return newCommissionMovement
  }

  static async reinvestCommissions(userId) {
    const agent = await UserModel.find(userId)

    if (!agent) {
      throw new CommissionException("No agent was found for the provided id.")
    }

    const commissionsToReinvest = await this._getCommissionsToReinvest(agent._id)

    if (!commissionsToReinvest) {
      throw new CommissionException("Can't find the last commission to reinvest movement, so no reinvestment will be added.")
    }

    // get the amount that need to be reinvested
    const reinvestmentAmount = commissionsToReinvest.amountChange

    // create the movement for the reinvestment if the reinvestment amount is > 0
    if (reinvestmentAmount > 0) {
      const movement = await MovementModel.create({
        userId: userId,
        movementType: MovementTypes.COMMISSIONS_REINVESTMENT,
        amountChange: reinvestmentAmount,
        interestPercentage: +agent.contractPercentage,
      })

      commissionsToReinvest.movementId = movement._id
      commissionsToReinvest.processed = true

      await commissionsToReinvest.save()
    }

    return commissionsToReinvest
  }

  static async collectCommissions(userId, collectAmount) {
    if (!collectAmount) {
      throw new CommissionException("The collect amount must be greater then 0.")
    }

    const agent = await UserModel.find(userId)

    if (!agent) {
      throw new CommissionException("No agent was found for the provided id.")
    }

    const lastCommission = await this._getLastCommission(agent._id)

    if (!lastCommission) {
      throw new CommissionException("Can't find the last commission movement, so no reinvestment will be added.")
    }

    // Check if the requested amount is available
    if (lastCommission.currMonthCommissions < collectAmount) {
      throw new CommissionException("There requested amount is higher than the available amount.")
    }

    const newCommissionMovement = await this._create({
      userId: agent._id,
      commissionType: CommissionType.COMMISSIONS_COLLECTED,
      amountChange: collectAmount,
    }, lastCommission)

    return newCommissionMovement
  }

  static async getLast(userId) {
    // for the current state i get the last movement which will contain
    // totalCommissions, that represent the current amount of available commissions.
    const currentState = await this._getLastCommission(userId)

    // I search all the collected commission

    return {
      monthCommissions: currentState ? currentState.totalCommissione : 0
    }

  }

  static async getAll(userId) {
    return this.where({userId: castToObjectId(userId)})
      .with("user")
      .sort({created_at: -1})
      .fetch()
  }

  user() {
    return this.hasOne("App/Models/User", "clientId", "_id")
      .setVisible(["_id", "firstName", "lastName", "role"])
  }

  setMovementId(value) {
    return castToObjectId(value)
  }

  setUserId(value) {
    return castToObjectId(value)
  }

  setClientId(value) {
    return castToObjectId(value)
  }
}

module.exports = Commission
