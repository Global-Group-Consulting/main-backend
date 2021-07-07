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
   * @returns {{year: number, month: number, semester: number}}
   */
  static get currentSemester() {
    const year = moment().year();
    const semester = moment().month() < 6 ? 1 : 2;
    const month = semester === 1 ? 0 : 6;

    return {year, month, semester};
  }

  /**
   * @returns {string}
   */
  static get currentSemesterString() {
    const currSemesterObj = this.currentSemester;

    return currSemesterObj.year + "_" + currSemesterObj.semester;
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
      referenceSemester: +data.semesterId.split("_")[1] || (moment().month() < 6 ? 1 : 2)
    })
  }

  static async manualRemove(data) {
    /*
    When removing i must remove them from the last semester still available
     */

    return super.create({
      ...data,
      movementType: BriteMovementTypes.DEPOSIT_REMOVED,
      referenceSemester: +data.semesterId.split("_")[1]
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
      .with("referenceAgentData")
      .setVisible(["firstName", "lastName", "id", "email", "gold", "clubPack", "clubCardNumber", "role"])
      .sort({lastName: 1, firstName: 1})
      .fetch()

    const jsonResult = result.toJSON()
    const nowDate = moment()

    return Promise.all(jsonResult.map(async user => {
        const currYear = nowDate.year();
        const semester = nowDate.month() > 6 ? 2 : 1;
        const blocksData = await this.getBlocksDataForUSer(null, user.brites)

        user.britesTotal = 0;
        user.britesUsed = 0;
        user.britesAvailable = 0;

        for (let entry of Object.entries(blocksData)) {
          const semesterId = entry[0];
          const entryYear = +semesterId.split("_")[0];
          const entrySemester = +semesterId.split("_")[1];

          // Se l'anno è lo stesso di quello corrente e anche il semestre è uguale all'attuale o maggiore
          if (entryYear === currYear && entrySemester >= semester) {
            continue
          }

          user.britesTotal += entry[1].briteTotal;
          user.britesUsed += entry[1].briteUsed;
          user.britesAvailable += entry[1].briteAvailable;
        }

        delete user.brites

        /*user.britesTotal = finalBrites.total
        user.britesUsed = finalBrites.used
        user.britesAvailable = finalBrites.available*/

        return user
      })
    )
  }

  static async getBlocksDataForUSer(userId, userBrites) {
    const currSemester = this.currentSemester

    const minExpiration = moment().toDate();

    /**
     * @type {VanillaSerializer}
     */
    const userMovements = userBrites || (await this.where({
      userId: castToObjectId(userId),
      expiresAt: {$gte: minExpiration}
    }).sort({created_at: -1}).fetch()).rows

    /**
     * @type {Record<string, {briteTotal: number, briteUsed: number, briteAvailable: number,
              usableFrom: Date, expiresAt: Date,
              byPack: {unsubscribed: number,
                        basic: number,
                        fast: number,
                        premium: number
                      }}>}
     */
    const toReturn = {}

    for (let i = 0; i < userMovements.length; i++) {
      /** @type {Brite} */
      const movement = userMovements[i]
      const semesterId = movement.semesterId
      const createdAt = moment(movement.created_at)

      // If exists a semesterId use it, otherwise create it from the created_at date
      const semesterName = semesterId ? semesterId : (createdAt.year() + "_" + movement.referenceSemester)

      if (!toReturn[semesterName]) {
        toReturn[semesterName] = {
          briteTotal: 0,
          briteUsed: 0,
          briteAvailable: 0,
          usableFrom: movement.usableFrom,
          expiresAt: movement.expiresAt,
          byPack: {
            unsubscribed: 0,
            basic: 0,
            fast: 0,
            premium: 0,
          }
        }
      }

      switch (movement.movementType) {
        case BriteMovementTypes.INTEREST_RECAPITALIZED:
        case BriteMovementTypes.DEPOSIT_ADDED:
          toReturn[semesterName].briteAvailable += movement.amountChange

          // Calculate the total brites available only by summing the positive movements
          toReturn[semesterName].briteTotal += movement.amountChange

          if (movement.clubPack) {
            toReturn[semesterName].byPack[movement.clubPack] += movement.amountChange;
          }

          break;
        case BriteMovementTypes.DEPOSIT_COLLECTED:
        case BriteMovementTypes.DEPOSIT_REMOVED:
        case BriteMovementTypes.DEPOSIT_TRANSFERED: {
          toReturn[semesterName].briteUsed += movement.amountChange
          toReturn[semesterName].briteAvailable -= movement.amountChange

          if (movement.clubPack) {
            toReturn[semesterName].byPack[movement.clubPack] -= movement.amountChange;
          }
        }
      }
    }

    return toReturn
  }

  user() {
    return this.belongsTo("App/Models/User", "userId", "_id")
  }

}

module.exports = BriteModel
