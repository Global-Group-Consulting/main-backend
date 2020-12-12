'use strict'

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Env = use("Env")

const UserModel = use("App/Models/User")
const UserRoles = require("../../enums/UserRoles")
const RequestTypes = require("../../enums/RequestTypes")
const CommissionType = require("../../enums/CommissionType")

const User = exports = module.exports = {}

User.onApproved = async (approvedRequest) => {
  if (approvedRequest.type === RequestTypes.VERSAMENTO) {
    const user = await UserModel.find(approvedRequest.userId)

    // if the user doesn't have a referenceAgent, is useless to call
    // agent new deposit commission.
    if (!user.referenceAgent) {
      return
    }

    // when a request is approved the type is always "NEW_DEPOSIT" because only
    // deposit request get approved.
    await Queue.add("agent_commissions_on_new_deposit", {
      type: CommissionType.NEW_DEPOSIT,
      movementId: approvedRequest.movementId.toString()
    })
  }
}
