'use strict'

/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Env = use("Env")

const UserModel = use("App/Models/User")
const UserRoles = require("../../enums/UserRoles")
const RequestTypes = require("../../enums/RequestTypes")

const User = exports = module.exports = {}

User.onApproved = async (approvedRequest) => {
  if (approvedRequest.type === RequestTypes.VERSAMENTO) {
    const referenceAgent = await UserModel.find(approvedRequest.userId).referenceAgentData().first()

    // if the user doesn't have a referenceAgent, is useless to call
    // agent new deposit commission.
    if (!referenceAgent || !referenceAgent._id) {
      return
    }

    // TODO:: create a unique method that, by passing a param knows what type of commission must be added.
    await Queue.add("agent_new_deposit_commission", approvedRequest.movementId)
  }
}
