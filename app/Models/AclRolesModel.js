'use strict'

/** @typedef {import("../../@types/Acl/Roles").AclRole} AclRole */

/** @type {import('../../classes/BasicModel')} */
const BasicModel = require('../../classes/BasicModel')

/** @type {typeof import('./AclPermissionsModel')} */
// const AclPermissionsModel = use("App/Model/AclPermissionsModel")

class AclRolesModel extends BasicModel {
  static get connection() {
    return 'mongoIAM'
  }
  
  static get collection() {
    return 'roles'
  }
  
  /**
   * Get all permissions for the provided roles as a flat array of strings
   *
   * @param {string[]} roles
   * @param {string[]} directPermissions
   * @returns {Promise<string[]>}
   */
  static async getAllPermissions(roles, directPermissions) {
    let lists = [];
    const rolesData = await this.where({code: {$in: roles}}).fetch();
    
    for (const role of rolesData.rows || []) {
      lists.push(role.permissions)
    }
    
    if (directPermissions) {
      lists.push(directPermissions)
    }

    return Array.from(new Set(lists.flat())).sort();
  }

  /*static async createIfNew(code, data) {
    const exists = await AclRolesModel.findBy(code, 'admin')

    if (exists) {
      return
    }

    return this.create(data)
  }*/

/*  setCode(value) {
    return value ? value.toLowerCase().replace(/\s/g, "_") : value
  }*/
}

module.exports = AclRolesModel
