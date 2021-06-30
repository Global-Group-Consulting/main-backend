'use strict'

/** @typedef {import("../../@types/Request.d").Request} IRequest */


/** @type {import("../../providers/Queue")} */
const Queue = use("QueueProvider")
const Env = use("Env")
const Event = use("Event")
const Antl = use('Antl')
const AgentBrite = use("App/Models/AgentBrite")

const UserModel = use("App/Models/User")
const RequestModel = use("App/Models/Request")
const CommissionModel = use("App/Models/Commission")
const SettingsProvider = use("SettingsProvider")

const UserRoles = require("../../enums/UserRoles")
const RequestTypes = require("../../enums/RequestTypes")
const RequestStatus = require("../../enums/RequestStatus")
const CommissionType = require("../../enums/CommissionType")
const AgentTeamType = require("../../enums/AgentTeamType")

const {
  formatMoney,
} = require("../Helpers/ModelFormatters")

const Request = exports = module.exports = {
  addAgentCommission
}

Request.onNewRequest = onNewRequest
Request.onApproved = onApproved
Request.onCancelled = onCancelled
Request.onRejected = onRejected
Request.onAutoWithdrawlCompleted = onAutoWithdrawlCompleted
Request.onAutoWithdrawlRecursiveCompleted = onAutoWithdrawlRecursiveCompleted

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onNewRequest(request) {
  Event.emit("notification::requestNew", request)

  if ([RequestTypes.RISC_INTERESSI_BRITE, RequestTypes.RISC_INTERESSI_GOLD].includes(request.type)) {
    // Get this data from the settings
    const clubRequestNotifyEmail = SettingsProvider.get("clubRequestNotifyEmail");

    if (!clubRequestNotifyEmail) {
      return;
    }

    //const receiverEmail = "richiestegold@globalgroup.consulting";
    const user = await request.user().fetch();
    const requestId = RequestTypes.get(request.type).id

    await Queue.add("send_email", {
      tmpl: "new_club_request",
      data: {
        email: clubRequestNotifyEmail,
        username: user.firstName + " " + user.lastName,
        requestType: Antl.compile('it', `enums.RequestTypes.${requestId}`),
        amount: formatMoney(request.amount),
        siteLink: Env.get('PUBLIC_URL') + "/requests#" + request._id.toString()
      }
    })
  }
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

/**
 * @param {string} requestId
 * @param {number} amountChange
 * @returns {Promise<void>}
 */
async function onAutoWithdrawlCompleted(requestId, amountChange, commissionId) {
  const request = await RequestModel.find(requestId);
  const commission = await CommissionModel.find(request.movementId || commissionId)

  // Update the request state
  request.amount = amountChange
  request.status = RequestStatus.ACCETTATA
  request.cancelReason = "request completed because not recursive"
  request.completed_at = new Date().toISOString()
  request.autoWithdrawlAllRevoked = true;

  // If i'm here, the request is about collection commissions, so no need to check if i must add brites.
  RequestModel.calcRightAmount(request);

  request.briteMovementId = await AgentBrite.addBrites(request)

  await request.save()

  // Updated commission data so that i can know what happened
  if (commission) {
    commission.amountEuro = request.amountEuro;
    commission.amountBrite = request.amountBrite;
    commission.briteConversionPercentage = request.briteConversionPercentage;
    commission.currency = request.currency;
    commission.requestId = request._id;

    await commission.save()
  }


  // Reset the users data
  const associatedUser = await request.user().fetch()

  associatedUser.autoWithdrawlAll = null
  associatedUser.autoWithdrawlAllRecursively = null

  // Updates user's data by resetting the autoWithdrawlAll
  await associatedUser.save()
}

/**
 * @param {string} requestId
 * @param {number} amountChange
 * @param {any} commissionId
 * @returns {Promise<void>}
 */
async function onAutoWithdrawlRecursiveCompleted(requestId, amountChange, commissionId) {
  const request = await RequestModel.find(requestId);

  if (!request.previousResults) {
    request.previousResults = []
  }

  // Update the request state
  request.lastRun = new Date();
  request.previousResults.push({
    lastRun: request.lastRun,
    amount: amountChange,
    commissionId
  })

  await request.save()
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

async function addAgentCommission(user, movementId) {
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

    if (!directAgent) {
      return
    }

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
