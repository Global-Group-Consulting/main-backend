'use strict'
/** @typedef {import("../../../@types/Acl/Permissions").AclPermission} AclPermission */

const {WhitelistValidator} = require("../WhitelistValidator")

class AclUpdatePermission extends WhitelistValidator {
  get includeParams() {
    return true
  }

  /**
   * @returns {Partial<AclPermission>}
   */
  get rules() {
    return {
      id: "required|objectId",
      description: "string",
    }
  }
}

module.exports = AclUpdatePermission
