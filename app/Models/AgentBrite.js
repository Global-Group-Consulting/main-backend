'use strict'

/**
 * @typedef {import('../../@types/AgentBrites').AgentBrites} AgentBrites
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AgentBritesType = require("../../enums/AgentBritesType")
const {castToObjectId} = require("../Helpers/ModelFormatters")

class AgentBrite extends Model {
  /**
   * @param {AgentBrites} payload
   * @returns {Promise<Model<AgentBrites>>}
   * @private
   */
  static async _create(payload) {
    return AgentBrite.create(payload)
  }

  /**
   *
   * @param userId
   * @returns {Promise<number>}
   * @private
   */
  static async _getTotalBrites(userId) {
    /**
     * @type {AgentBrites}
     */
    const movement = await this.where({userId: castToObjectId(userId)}).sort({created_at: -1}).first();
    let value = 0;

    if (movement && movement.deposit !== undefined) {
      value = movement.deposit;
    }

    return value
  }

  static async _getCurrMonthBrites(userId) {
    let value = 0;

    return value;
  }

  /**
   * @param {string} userId
   * @return {Promise<AgentBrites>}
   */
  static async lastMovement(userId) {
    return AgentBrite.where({userId: castToObjectId(userId)}).sort({"created_at": -1}).first()
  }

  /**
   * @param {import("../../@types/Request").Request} request
   * @return {ObjectId}
   */
  static async addBrites(request) {
    /**
     * @type {AgentBrites}
     */
    const lastMovement = await this.lastMovement(request.userId);
    const oldDeposit = lastMovement && lastMovement.deposit ? lastMovement.deposit : 0;

    const newMovement = await this._create({
      amount: request.amountBrite,
      type: AgentBritesType.FROM_WITHDRAWL,
      deposit: oldDeposit + request.amountBrite, //new deposit
      oldDeposit,
      userId: castToObjectId(request.userId),
      requestPercent: request.briteConversionPercentage,
      requestTotal: request.amount,
      requestId: castToObjectId(request._id)
    })

    return newMovement._id
  }

  /**
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  static async getStatistics(userId) {
    return {
      agentBritesTotal: await this._getTotalBrites(userId),
      agentBritesCurrMonth: await this._getCurrMonthBrites(userId),
    }
  }
}

module.exports = AgentBrite
