'use strict'

/**@typedef {import('../../../../@types/Brite/Brite').Brite} Brite */

const User = use("App/Models/User")
const BriteHook = exports = module.exports = {}
const moment = require("moment");
const {calcBritesUsage} = require("../../../Helpers/Brites/CalcBritesUsage");
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

  const {usableFrom, expiresAt} = calcBritesUsage(modelInstance.semesterId)

  modelInstance.deposit = newDeposit
  modelInstance.depositOld = oldDeposit

  // I set the expires and usable date for each movement,
  // so when i must group them by semester,
  // is easier
  modelInstance.usableFrom = usableFrom.toDate()
  modelInstance.expiresAt = expiresAt.toDate()

  const user = await User.find(modelInstance.userId);

  // Store the relative user active pack
  modelInstance.clubPack = user.clubPack;
}
