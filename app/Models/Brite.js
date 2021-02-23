'use strict'

/**@typedef {import('../../@types/Brite/Brite').Brite} Brite */

/**
 * @type {typeof import('@adonisjs/lucid/src/Lucid/Model')}
 */
const BasicModel = require('../../classes/BasicModel')

/** @type {typeof import('./user')} */
const UsersModel = use('App/Models/User')

const BriteMovementTypes = require("../../enums/BriteMovementTypes")
const moment = require("moment");

const {castToObjectId} = require("../Helpers/ModelFormatters")

class BriteModel extends BasicModel {
  static boot() {
    super.boot()

    this.addHook("beforeCreate", "Club/BriteHook.beforeCreate")

  }

  /**
   * Manually add brites to a user
   *
   * @param data
   * @returns {Promise<Model>}
   */
  static async manualAdd(data) {
    return super.create({
      ...data,
      movementType: BriteMovementTypes.DEPOSIT_ADDED,
      // i'm using the  current date as a reference.
      // Maybe could be useful to ask the user what date want's to use
      referenceSemester: moment().month() < 6 ? 1 : 2
    })
  }

  static async useRequest(data) {
    /*return super.create({
      ...data,
      movementType: BriteMovementTypes.DEPOSIT_COLLECTED,
      // i'm using the  current date as a reference.
      // Maybe could be useful to ask the user what date want's to use
      referenceSemester: moment().month() < 6 ? 1 : 2
    })*/
  }

  /**
   *
   * @param {{amountChange: number, userId: any}} data
   * @returns {Promise<Model>}
   */
  static async recapitalizationAdd(data) {
    return super.create({
      ...data,
      movementType: BriteMovementTypes.INTEREST_RECAPITALIZED,
      referenceSemester: moment().month() < 6 ? 1 : 2
    })
  }

  static async getLastMovement(userId) {
    return this.where({userId: userId}).sort({_id: -1}).first()
  }

  static async getClubUsers() {
    const result = await UsersModel.query()
      .where({gold: true})
      .with("brites")
      .setVisible(["firstName", "lastName", "id", "email", "gold", "clubPack", "clubCardNumber", "role"])
      .sort({lastName: 1, firstName: 1})
      .fetch()

    const jsonResult = result.toJSON()
    const nowDate = moment()

    return jsonResult.map(user => {
      const finalBrites = {total: 0, used: 0, available: 0}

      for (const entry of user.brites) {
        // Check if the movement is not yet usable or is expired
        if (moment(entry.usableFrom).isAfter(nowDate) || moment(nowDate).isAfter(entry.expiresAt)) {
          continue
        }

        finalBrites.total += entry.amountChange
        finalBrites.used += [BriteMovementTypes.DEPOSIT_COLLECTED].includes(entry.movementType) ? entry.amountChange : 0
        finalBrites.available = finalBrites.total - finalBrites.used
      }

      delete user.brites

      user.britesTotal = finalBrites.total
      user.britesUsed = finalBrites.used
      user.britesAvailable = finalBrites.available

      return user
    })
  }

  static async getBlocksDataForUSer(userId) {
    /**
     * @type {VanillaSerializer}
     */
    const userMovements = await this.where({userId: castToObjectId(userId)})
      .sort({created_at: -1}).fetch()
    const toReturn = {}

    for (let i = 0; i < userMovements.rows.length; i++) {
      /** @type {Brite} */
      const movement = userMovements.rows[i]
      const createdAt = moment(movement.created_at)
      const semesterName = createdAt.year() + "_" + movement.referenceSemester

      if (!toReturn[semesterName]) {
        toReturn[semesterName] = {
          briteTotal: 0,
          briteUsed: 0,
          briteAvailable: 0
        }
      }

      toReturn[semesterName].briteTotal += movement.amountChange

      switch (movement.movementType) {
        case BriteMovementTypes.INTEREST_RECAPITALIZED:
        case BriteMovementTypes.DEPOSIT_ADDED:
          toReturn[semesterName].briteAvailable += movement.amountChange

          break;
        case BriteMovementTypes.DEPOSIT_COLLECTED: {
          toReturn[semesterName].briteUsed += movement.amountChange
          toReturn[semesterName].briteAvailable -= movement.amountChange
        }
      }
    }

    return toReturn
  }

}

module.exports = BriteModel
