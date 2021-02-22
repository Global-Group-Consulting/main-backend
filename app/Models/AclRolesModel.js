'use strict'

/** @typedef {import("../../@types/Acl/Roles").AclRole} AclRole */

/** @type {import('../../classes/BasicModel')} */
const BasicModel = require('../../classes/BasicModel')

/** @type {typeof import('./AclPermissionsModel')} */
// const AclPermissionsModel = use("App/Model/AclPermissionsModel")

class AclRolesModel extends BasicModel {
  /**
   * Get all permissions for the provided roles as a flat array of strings
   *
   * @param {string[]} roles
   * @returns {Promise<string[]>}
   */
  static async getAllPermissions(roles) {
    let toReturn = []

    for (const role of roles || []) {
      /**
       * @type {AclRole}
       */
      const roleData = await this.where({code: role}).first()

      toReturn.push(...roleData.permissions)
    }

    return toReturn
  }

  setCode(value) {
    return value ? value.toLowerCase().replace(/\s/g, "_") : value
  }
}

module.exports = AclRolesModel
