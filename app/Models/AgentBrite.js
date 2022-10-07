'use strict'

/**
 * @typedef {import('../../@types/AgentBrites').AgentBrites} AgentBrites
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const AgentBriteException = use('App/Exceptions/AgentBriteException')

const AgentBritesType = require('../../enums/AgentBritesType')
const { castToObjectId } = require('../Helpers/ModelFormatters')
const CommissionType = require('../../enums/CommissionType')

/**
 * @property {number} amount
 * @property {string} type
 * @property {number} deposit
 * @property {number} oldDeposit
 * @property {string} userId
 * @property {number} requestPercent
 * @property {number} requestTotal
 * @property {string} requestId
 * @property {string} created_at
 * @property {string} updated_at
 */
class AgentBrite extends Model {
  /**
   * @param {AgentBrites} payload
   * @returns {Promise<Model<AgentBrites>>}
   * @private
   */
  static async _create (payload) {
    return AgentBrite.create(payload)
  }
  
  /**
   *
   * @param userId
   * @returns {Promise<number>}
   * @private
   */
  static async _getTotalBrites (userId) {
    /**
     * @type {AgentBrites}
     */
    const movement = await this.where({ userId: castToObjectId(userId) }).sort({ created_at: -1 }).first()
    let value = 0
    
    if (movement && movement.deposit !== undefined) {
      value = movement.deposit
    }
    
    return value
  }
  
  static async _getCurrMonthBrites (userId) {
    let value = 0
    
    return value
  }
  
  /**
   * @param {string} userId
   * @param {string|null} beforeDate
   * @return {Promise<AgentBrites>}
   */
  static async lastMovement (userId, beforeDate = null) {
    const query = {
      userId: castToObjectId(userId)
    }
    
    if (beforeDate) {
      query.created_at = {
        $lt: beforeDate
      }
    }
    
    return AgentBrite.where(query).sort({ 'created_at': -1 }).first()
  }
  
  /**
   * @param {import('../../@types/Request').Request} request
   * @return {ObjectId}
   */
  static async addBritesFromRequest (request) {
    /**
     * @type {AgentBrites}
     */
    const lastMovement = await this.lastMovement(request.userId)
    const oldDeposit = lastMovement && lastMovement.deposit ? lastMovement.deposit : 0
    
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
   * Add brites after a withdraw movement has been generated
   *
   * @param {{}} commissionMovement
   * @return {Model<AgentBrite>}
   */
  static async addBritesFromWithdraw (commissionMovement) {
    /**
     * @type {AgentBrites}
     */
    const lastMovement = await this.lastMovement(commissionMovement.userId, commissionMovement.created_at)
    const oldDeposit = lastMovement && lastMovement.deposit ? lastMovement.deposit : 0
    
    const newMovement = await this._create({
      amount: commissionMovement.amountBrite,
      type: AgentBritesType.FROM_WITHDRAWL,
      deposit: oldDeposit + commissionMovement.amountBrite, //new deposit
      oldDeposit,
      userId: castToObjectId(commissionMovement.userId),
      requestPercent: commissionMovement.briteConversionPercentage,
      requestTotal: commissionMovement.amountChange,
      commissionId: castToObjectId(commissionMovement._id)
    })
    
    // use the same created at as the commission movement
    newMovement.created_at = commissionMovement.created_at
    newMovement.save()
    
    // ricalcolare i totale dei movimenti successivi
    await this.updatedNextTotals(newMovement)
    
    return newMovement
  }
  
  /**
   * Update the deposit of all the movements after the given one
   *
   * @param {AgentBrite} newMovement
   * @return {Promise<void>}
   */
  static async updatedNextTotals (newMovement) {
    // must update movements after the new one
    const movements = await AgentBrite.where({
      // the user is the same of the movement to delete
      'userId': newMovement.userId,
      'created_at': {
        $gt: newMovement.created_at
      }
    }).sort({ 'created_at': -1 }).fetch()
    
    for (let i = (movements.rows.length - 1); i >= 0; i--) {
      /** @type {AgentBrites & Model} */
      const movement = movements.rows[i]
      const isFirst = i === movements.rows.length - 1
      
      if (movement._id.toString() === newMovement._id.toString()) {
        continue
      }
      
      movement.oldDeposit = isFirst ? newMovement.deposit : movements.rows[i + 1].deposit
      
      if (movement.type === AgentBritesType.MANUAL_REMOVE) {
        movement.deposit = movement.oldDeposit - movement.amount
      } else {
        movement.deposit = movement.oldDeposit + movement.amount
      }
      
      movement.save()
    }
  }
  
  /**
   * @param {{amount: number, userId: string, motivation: string}} payload
   * @return {Promise<void>}
   */
  static async add (payload) {
    /** @type {AgentBrites} */
    const lastMovement = await this.lastMovement(payload.userId)
    const oldDeposit = lastMovement && lastMovement.deposit ? lastMovement.deposit : 0
    
    return this._create({
      amount: payload.amount,
      type: AgentBritesType.MANUAL_ADD,
      deposit: oldDeposit + payload.amount, //new deposit
      oldDeposit,
      motivation: payload.motivation,
      userId: castToObjectId(payload.userId)
    })
  }
  
  /**
   * @param {{amount: number, userId: string, motivation: string}} payload
   * @return {Promise<void>}
   */
  static async remove (payload) {
    /** @type {AgentBrites} */
    const lastMovement = await this.lastMovement(payload.userId)
    const oldDeposit = lastMovement && lastMovement.deposit ? lastMovement.deposit : 0
    
    if (payload.amount > oldDeposit) {
      throw new AgentBriteException('There requested amount is higher than the available amount.')
    }
    
    return this._create({
      amount: payload.amount,
      type: AgentBritesType.MANUAL_REMOVE,
      deposit: oldDeposit - payload.amount, //new deposit
      oldDeposit,
      motivation: payload.motivation,
      userId: castToObjectId(payload.userId)
    })
  }
  
  /**
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  static async getStatistics (userId) {
    return {
      agentBritesTotal: await this._getTotalBrites(userId),
      agentBritesCurrMonth: await this._getCurrMonthBrites(userId)
    }
  }
}

module.exports = AgentBrite
