'use strict'

/**@typedef {import('../../../../@types/Brite/Brite').Brite} Brite */

const BriteHook = exports = module.exports = {}
const moment = require("moment");

/**
 * @param {Brite} modelInstance
 */
BriteHook.beforeCreate = async (modelInstance) => {
  /**
   * @type {Brite}
   */
  const lastMovement = await modelInstance.constructor.getLastMovement(modelInstance.userId)
  let newDeposit = modelInstance.amountChange
  let oldDeposit = 0

  if (lastMovement) {
    oldDeposit = lastMovement.deposit || 0
    newDeposit = oldDeposit + modelInstance.amountChange
  }

  const createdAt = moment(modelInstance.created_at)
  const usableFrom = modelInstance.referenceSemester === 1 ?
    moment().set({date: 1, month: 6, year: createdAt.year()}) :
    moment().set({date: 1, month: 0, year: createdAt.year() + 1})
  const expiresAt = moment(usableFrom).add(1, "year")

  modelInstance.deposit = newDeposit
  modelInstance.depositOld = oldDeposit

  // I set the expires and usable date for each movement, so when i must group them by semester,
  // is easier
  modelInstance.usableFrom = usableFrom.toDate()
  modelInstance.expiresAt = expiresAt.toDate()
}
