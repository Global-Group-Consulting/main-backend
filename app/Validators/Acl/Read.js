'use strict'
const {WhitelistValidator} = require("../WhitelistValidator")

class AclRead extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "required|objectId",
    }
  }
}

module.exports = AclRead
