'use strict'

/** @typedef {import("../../../@types/Acl/Roles").AclRole} AclRole */

const {WhitelistValidator} = require("../WhitelistValidator")


class AclCreateRole extends WhitelistValidator {
  /**
   * @returns {AclRole}
   */
  get rules() {
    return {
      code: "required|string",
      description: "required|string",
      permissions: "required|array",
    }
  }
}

module.exports = AclCreateRole
