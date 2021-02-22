'use strict'
const {WhitelistValidator} = require("../WhitelistValidator")

class BriteRead extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "required|objectId",
    }
  }
}

module.exports = BriteRead
