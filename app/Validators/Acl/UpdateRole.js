'use strict'
/** @typedef {import("../../../@types/Acl/Roles").AclRole} AclRole */

const {WhitelistValidator} = require("../WhitelistValidator")

class AclUpdateRole extends WhitelistValidator {
  get includeParams() {
    return true
  }

  /**
   * @returns {Partial<AclRole>}
   */
  get rules() {
    return {
      id: "required|objectId",
      description: "string",
      permissions: "array",
    }
  }
}

module.exports = AclUpdateRole
