'use strict'


/** @type {typeof import("../../../../@types/AgentBrites").AgentBrites} */
const AgentBrite = use("App/Models/AgentBrite");

/** @type {import("../../../../@types/Acl/AclProvider").AclProvider} */
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

    return AgentBrite.where("userId", castToObjectId(userId))
      .sort({"created_at": -1})
      .fetch();
  }

  /**
   * Add new brites
   * @param {Request} request
   */
  async add({request}) {

  }

  /**
   * Removes existing brites
   * @param {Request} request
   */
  async remove({request}) {

  }

  async statistics({params, auth}) {

    const userRole = auth.user.role
    let userId = auth.user._id

    let hasSubAgents = false

    if (auth.user.role === UserRoles.AGENTE) {
      hasSubAgents = (await auth.user.subAgents().fetch()).rows.length > 0
    }

    if (([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) || hasSubAgents) && params["id"]) {
      userId = params["id"]
    }

    return await AgentBrite.getStatistics(userId)
  }
}

module.exports = AgentBriteController
