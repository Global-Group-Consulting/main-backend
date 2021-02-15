'use strict'
/** @typedef {import("../../../@types/Acl/dto/permissions.create.dto").PermissionsCreateDto} PermissionsCreateDto */

const {WhitelistValidator} = require("../WhitelistValidator")

class AclCreatePermission extends WhitelistValidator {

  /**
   * @returns {PermissionsCreateDto}
   */
  get rules() {
    return {
      code: "required|string",
      description: "required|string",
    }
  }
}

module.exports = AclCreatePermission
