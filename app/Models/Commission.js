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

  static async _getLastCommission() {
    return this.where({}).sort({created_at: -1}).first()
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

    // use that date as the date of the commission movement, so that when reinvesting it, will figure in the right month.
    const lastCommission = await this._getLastCommission()

    // create the movement in the database
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
  static async addExistingDepositCommission() {
    // get the client
    // get client's percentage of interest
    // get client's actual deposit of last recapitalization

    // calc the diff between 4 and the client's percentage.
    //   - If <= 0, will stop and won't add anything
    //   - If > 0 will calc the amount based on the client's actual deposit

    // create the movement in the database
  }

  /**
   * Commission that occurs yearly, based on the previous clients deposit.
   * This will calculate 6% of the clients deposit and split in in 3 months, april, august, december
   * @returns {Promise<void>}
   */
  static async addAnnualCommission() {
    // TBD
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
