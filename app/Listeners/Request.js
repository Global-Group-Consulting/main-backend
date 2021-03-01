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
const AgentTeamType = require("../../enums/AgentTeamType")

const Request = exports = module.exports = {
  addAgentCommission
}

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
    /**
     * @type {User}
     */
    const user = await UserModel.find(approvedRequest.userId)

    await addAgentCommission(user, approvedRequest.movementId)
  }

  Event.emit("notification::requestApproved", approvedRequest)
}

function _getAgentActiveCommission(agent, requiredType) {
  // get the agent active commissions
  const agentCommissions = agent.commissionsAssigned ? agent.commissionsAssigned.map(_obj => JSON.parse(_obj)) : null

  /** @type {{name: CommissionType, percent: number}} */
  const currentCommissionSettings = agentCommissions.find(_entry => _entry.name === requiredType)

  return currentCommissionSettings || null
}

/**
 *
 * @param {string} teamCommissionType
 * @param {User} agent
 * @param {User} subAgent
 * @returns number|null
 * @private
 */
function _calcPercentageToApply(teamCommissionType, agent, subAgent) {
  if (teamCommissionType === AgentTeamType.SUBJECT_PERCENTAGE) {
    return null
  }

  const subAgentPercentage = _getAgentActiveCommission(subAgent, CommissionType.NEW_DEPOSIT)
  const groupPercentage = _getAgentActiveCommission(agent, CommissionType.NEW_DEPOSIT)

  // If the subAgent doesn't have activate NewDeposit commission, returns null,
  // so the percentage can be calculated as usual, because it must not be splatted.
  if (!subAgentPercentage) {
    return null
  }

  return +groupPercentage.percent - +subAgentPercentage.percent
}

async function addAgentCommission(user, movementId){
  // if the user doesn't have a referenceAgent, is useless to call
  // agent new deposit commission.
  if (user.referenceAgent) {
    // when a request is approved the type is always "NEW_DEPOSIT" because only
    // deposit request get approved.
    // Commission for main agent
    await Queue.add("agent_commissions_on_new_deposit", {
      type: CommissionType.NEW_DEPOSIT,
      movementId: movementId.toString(),
      agentId: user.referenceAgent.toString()
    })

    /** @type {User} */
    const directAgent = await user.referenceAgentData().fetch()

    /** @type {User} */
    let referenceAgent = directAgent

    /** @type {User[]} */
    let agentsChain = []

    // Check if there are other agent over the agent,
    // and for each one add a commission entry,
    // because each one must have its commission

    // First, create an array of all parents agents
    while (referenceAgent.referenceAgent) {
      referenceAgent = await referenceAgent.referenceAgentData().fetch()

      agentsChain.push(referenceAgent)
    }

    // Second, get the team commission type to use and apply
    // if for any reason, no commission type was found, fallback to Subject percentage
    const teamCommissionType = (agentsChain.length > 0 ? agentsChain[agentsChain.length - 1].agentTeamType : directAgent.agentTeamType) || AgentTeamType.SUBJECT_PERCENTAGE

    // Finally, for each parent agent, add an entry to the queue
    for (let i = 0; i < agentsChain.length; i++) {
      const agent = agentsChain[i]
      const subAgent = i > 0 ? agentsChain[i - 1] : await user.referenceAgentData().fetch()
      const percentageToApply = _calcPercentageToApply(teamCommissionType, agent, subAgent)

      /*
      If the percentage is 0, indicates that the difference between the subAgent and the group
      percentage is 0, so the parent agent doesn't have to get any commission
       */
      if (percentageToApply === 0) {
        continue
      }

      await Queue.add("agent_commissions_on_new_deposit", {
        type: CommissionType.NEW_DEPOSIT,
        movementId: movementId.toString(),
        agentId: agent._id.toString(),
        indirectCommission: true,
        // This can be null or >0. If null, will be ignored by the function that adds the commission
        // and will be used the agents commission instead.
        // Is is >0, will be used.
        percentageToApply,
        commissionsAssigned: agent.commissionsAssigned,
        teamCommissionType,
      })
    }
  }
}
