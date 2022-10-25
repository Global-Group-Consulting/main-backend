'use strict'


/** @type {typeof import("../../../../@types/AgentBrites").AgentBrites} */
const AgentBrite = use("App/Models/AgentBrite");
const AgentBriteException = use('App/Exceptions/AgentBriteException')

/** @type {import("../../../../providers/Acl/index")} */
const AclProvider = use('AclProvider')
const AclGenericException = use("App/Exceptions/Acl/AclGenericException")
const AclForbiddenException = use("App/Exceptions/Acl/AclForbiddenException")
const {AgentBritesPermissions} = require("../../../Helpers/Acl/enums/agentBrites.permissions");

const AgentBritesType = require("../../../../enums/AgentBritesType")
const UserRoles = require("../../../../enums/UserRoles")

const {castToObjectId} = require("../../../Helpers/ModelFormatters")

class AgentBriteController {
  /**
   * Read all entries
   * @returns {Collection<AgentBrite>}
   */
  async index({request, auth}) {
    const authId = auth.user._id.toString();
    const userId = request.input("userId") || authId;
    const requiredPermissions = [AgentBritesPermissions.AGENT_BRITES_ALL_READ, AgentBritesPermissions.AGENT_BRITES_GROUP_READ]

    if (!(await AclProvider.checkPermissions(requiredPermissions, auth))
      && userId !== authId) {
      throw new AclForbiddenException()
    }
  
    await AclProvider.checkAccessToUser(auth.user, userId)

    return AgentBrite.where("userId", castToObjectId(userId))
      .sort({"created_at": -1})
      .fetch();
  }

  /**
   * Add new brites
   * @param {Request} request
   * @param {{id: string}} params
   */
  async add({request, params}) {
    const userId = params.id;
    /**
     * @type {{amount: number, motivation: string, type: string}}
     */
    const incomingData = request.only(["amount", "motivation", "type"])

    if (incomingData.type !== AgentBritesType.MANUAL_ADD) {
      throw new AgentBriteException("The requested type is different from the expected one.")
    }

    return await AgentBrite.add({
      amount: incomingData.amount,
      motivation: incomingData.motivation,
      userId
    })
  }

  /**
   * Removes existing brites
   * @param {Request} request
   * @param {{id: string}} params
   */
  async remove({request, params}) {
    const userId = params.id;
    /**
     * @type {{amount: number, motivation: string, type: string}}
     */
    const incomingData = request.only(["amount", "motivation", "type"])

    if (incomingData.type !== AgentBritesType.MANUAL_REMOVE) {
      throw new AgentBriteException("The requested type is different from the expected one.")
    }

    return await AgentBrite.remove({
      amount: incomingData.amount,
      motivation: incomingData.motivation,
      userId
    })
  }

  async statistics({params, auth}) {
    const paramsId = params.id;
    let userId = auth.user._id

    let hasSubAgents = false

    if (auth.user.isAgent()) {
      hasSubAgents = (await auth.user.subAgents().fetch()).rows.length > 0
    }

    // If the user is not an admin or a reference agent, and is required a user id, block it.
    if ((auth.user.isAdmin() || hasSubAgents) && paramsId) {
      userId = paramsId;
    } else if (paramsId) {
      throw new AclForbiddenException();
    }

    return await AgentBrite.getStatistics(userId)
  }
}

module.exports = AgentBriteController
