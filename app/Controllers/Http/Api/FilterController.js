'use strict'

/** @type {typeof import("../../../Models/User")} */
const User = use("App/Models/User")

const UserRoles = require('../../../../enums/UserRoles')

class FilterController {

  async fetchUsersList() {
    return User.where({role: {"$in": [UserRoles.CLIENTE, UserRoles.AGENTE]}})
      .setVisible(["id", "firstName", "lastName"])
      .fetch()
  }

  async fetchAgentsList() {
    return User.where({role: {"$in": [UserRoles.AGENTE]}})
      .setVisible(["id", "firstName", "lastName"])
      .fetch()
  }
}

module.exports = FilterController
