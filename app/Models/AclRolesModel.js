'use strict'

/** @typedef {import("../../@types/Acl/Roles").AclRole} AclRole */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {typeof import('./AclPermissionsModel')} */
// const AclPermissionsModel = use("App/Model/AclPermissionsModel")

class AclRolesModel extends Model {
  static get hidden() {
    return ['_id', '__v']
  }

  static get computed() {
    return ["id"]
  }

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

  getId(value) {
    try {
      return this._id.toString()
    } catch (er) {
      return value
    }
  }
}

module.exports = AclRolesModel
