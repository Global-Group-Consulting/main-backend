'use strict'

/** @typedef {import("../../@types/Request.d").Request} IRequest */


/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Env = use("Env")
const Event = use("Event")

const UserModel = use("App/Models/User")
const UserRoles = require("../../enums/UserRoles")
const RequestTypes = require("../../enums/RequestTypes")
const CommissionType = require("../../enums/CommissionType")

const Request = exports = module.exports = {}

Request.onNewRequest = onNewRequest
Request.onApproved = onApproved
Request.onCancelled = onCancelled
Request.onRejected = onRejected

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onNewRequest(request) {
  Event.emit("notification::requestNew", request)
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRejected(request) {
  Event.emit("notification::requestRejected", request)
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onCancelled(request) {
  Event.emit("notification::requestCancelled", request)
}

/**
 * @param {IRequest} approvedRequest
 * @returns {Promise<void>}
 */
async function onApproved(approvedRequest) {
  if (approvedRequest.type === RequestTypes.VERSAMENTO) {
    const user = await UserModel.find(approvedRequest.userId)

    // if the user doesn't have a referenceAgent, is useless to call
    // agent new deposit commission.
    if (user.referenceAgent) {
      // when a request is approved the type is always "NEW_DEPOSIT" because only
      // deposit request get approved.
      await Queue.add("agent_commissions_on_new_deposit", {
        type: CommissionType.NEW_DEPOSIT,
        movementId: approvedRequest.movementId.toString()
      })
    }
  }

  Event.emit("notification::requestApproved", approvedRequest)
}
