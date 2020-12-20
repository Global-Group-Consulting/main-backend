'use strict'

/** @typedef {import('../../@types/Movement.d').IMovement} IMovement */

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const UserModel = use("App/Models/User")
const CommissionType = require("../../enums/CommissionType")

const Movements = exports = module.exports = {}

Movements.onInitial =
  /**
   * @param {IMovement} movement
   * @returns {Promise<void>}
   */
  async (movement) => {
    const user = await UserModel.find(movement.userId)

    // if the user doesn't have a referenceAgent, is useless to call
    // agent new deposit commission.
    if (!user.referenceAgent) {
      return
    }

    // when a request is approved the type is always "NEW_DEPOSIT" because only
    // deposit request get approved.
    await Queue.add("agent_commissions_on_new_deposit", {
      type: CommissionType.NEW_DEPOSIT,
      movementId: movement._id.toString()
    })
  }
