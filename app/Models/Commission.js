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
   * Commission that occurs each time a client of an agent invest new money
   * @returns {Promise<void>}
   */
  static async addNewDepositCommission(movementId) {
    const {movement, agent, user} = await this._getMovementRelatedDate(movementId)

    // get the agent percentage
    const agentCommissions = agent.commissionsAssigned ? agent.commissionsAssigned.map(_obj => JSON.parse(_obj)) : null

    /** @type {{name: CommissionType, percent: number}} */
    const currentCommissionSettings = agentCommissions.find(_entry => _entry.name === CommissionType.NEW_DEPOSIT)

    if (!agentCommissions || !currentCommissionSettings) {
      throw new CommissionException("This type of commission is not activated for this agent.")
    }

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
    const newCommissionMovement = await Commission.create({
      movementId: movementId,
      userId: agent._id,
      clientId: user._id,
      commissionType: CommissionType.NEW_DEPOSIT,
      dateReference: moment(dateOfCommission).toDate(),
      amountChange: commissionValue,
      commissionOnValue: newDeposit,
      commissionPercentage: agentCommissionPercentage,
      totalCommissions: (lastCommission ? (lastCommission.totalCommissions || 0) : 0) + commissionValue,
      totalCommissionsOld: lastCommission ? (lastCommission.totalCommissions || 0) : 0
    })

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

    // calc the diff between 4 and the client's percentage.
    const agentLeftPercentage = 4 - movement.interestPercentage

    // with the given percentage calc the value based on the user deposit
    const commissionValue = agentLeftPercentage * movement.deposit / 100

    const lastCommission = await this._getLastCommission(agent._id)

    // create the movement in the database
    const newCommissionMovement = await Commission.create({
      movementId: movementId,
      userId: agent._id,
      clientId: user._id,
      commissionType: CommissionType.TOTAL_DEPOSIT,
      dateReference: moment(movement.created_at).toDate(),
      amountChange: commissionValue,
      commissionOnValue: movement.deposit,
      commissionOnPercentage: movement.interestPercentage,
      commissionPercentage: agentLeftPercentage,
      totalCommissions: (lastCommission ? (lastCommission.totalCommissions || 0) : 0) + commissionValue,
      totalCommissionsOld: lastCommission ? (lastCommission.totalCommissions || 0) : 0
    })

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

  static async reinvestCommissions(userId) {
    const agent = await UserModel.find(userId)

    if (!agent) {
      throw new CommissionException("No agent was found for the provided id.")
    }

    const lastCommission = await this._getLastCommission(agent._id)

    if (!lastCommission) {
      throw new CommissionException("Can't find the last commission movement, so no reinvestment will be added.")
    }

    // get the amount that need to be reinvested
    const reinvestmentAmount = lastCommission.totalCommissions

    let movement

    // create the movement for the reinvestment if the reinvestment amount is > 0
    if (reinvestmentAmount > 0) {
      movement = await MovementModel.create({
        userId: userId,
        movementType: MovementTypes.COMMISSIONS_REINVESTMENT,
        amountChange: reinvestmentAmount,
        interestPercentage: +agent.contractPercentage,
      })
    }

    try {
      const newCommissionMovement = await Commission.create({
        movementId: movement ? movement._id : null,
        userId: agent._id,
        commissionType: CommissionType.COMMISSIONS_REINVESTMENT,
        amountChange: reinvestmentAmount,
        totalCommissions: lastCommission.totalCommissions - reinvestmentAmount,
        totalCommissionsOld: lastCommission.totalCommissions || 0
      })

      // There can be no movement if the reinvestment is 0
      if (movement) {
        // Save the commission id inside the movement that has been generated
        movement.commissionId = newCommissionMovement._id
        await movement.save()
      }

      return newCommissionMovement
    } catch (er) {
      await movement.delete()

      throw er
    }
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
    if (lastCommission.totalCommissions < collectAmount) {
      throw new CommissionException("There requested amount is higher than the available amount.")
    }

    const newCommissionMovement = await Commission.create({
      userId: agent._id,
      commissionType: CommissionType.COMMISSIONS_COLLECTED,
      amountChange: collectAmount,
      totalCommissions: lastCommission.totalCommissions - collectAmount,
      totalCommissionsOld: lastCommission.totalCommissions
    })

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
