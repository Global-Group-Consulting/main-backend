'use strict'

/**@typedef {import('../../../../@types/Brite/Brite').Brite} Brite */

const BriteHook = exports = module.exports = {}
const moment = require("moment");
const BriteMovementTypes = require("../../../../enums/BriteMovementTypes")

/**
 * @param {Brite} modelInstance
 */
BriteHook.beforeCreate = async (modelInstance) => {
  /**
   * @type {Brite}
   */
  const lastMovement = await modelInstance.constructor.getLastMovement(modelInstance.userId)
  const isRemoveType = [BriteMovementTypes.DEPOSIT_REMOVED, BriteMovementTypes.DEPOSIT_TRANSFERED].includes(modelInstance.movementType)
  let newDeposit = modelInstance.amountChange
  let oldDeposit = 0

  if (lastMovement) {
    oldDeposit = lastMovement.deposit || 0

    // If the movement is of remove type, i must subtract it from the new deposit
    if (isRemoveType) {
      newDeposit = oldDeposit - modelInstance.amountChange
    } else {
      newDeposit = oldDeposit + modelInstance.amountChange
    }
  }

  const createdAt = moment(modelInstance.created_at)
  let usableFrom
  let expiresAt

  const semesterData = modelInstance.semesterId.split("_")
  const semesterYear = +semesterData[0]

  usableFrom = moment().set({date: 1, month: modelInstance.referenceSemester === 1 ? 0 : 6, year: semesterYear})
  expiresAt = moment(usableFrom).add(1, "year")

  // If remove type, copy the usableFrom and expiresAt from the last movement
  // I should get this dates from the right semester
/*  if (isRemoveType) {
    usableFrom = moment().set({date: 1, month: modelInstance.referenceSemester === 1 ? 0 : 6, year: semesterYear})
    expiresAt = moment(usableFrom).add(1, "year")
  } else {
    usableFrom = modelInstance.referenceSemester === 1 ?
      moment().set({date: 1, month: 6, year: createdAt.year()}) :
      moment().set({date: 1, month: 0, year: createdAt.year() + 1})
    expiresAt = moment(usableFrom).add(1, "year")
  }*/

  modelInstance.deposit = newDeposit
  modelInstance.depositOld = oldDeposit

  // I set the expires and usable date for each movement,
  // so when i must group them by semester,
  // is easier
  modelInstance.usableFrom = usableFrom.toDate()
  modelInstance.expiresAt = expiresAt.toDate()
}
