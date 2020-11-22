'use strict'

const { WhitelistValidator } = require("../WhitelistValidator")

class MovementsCancel extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "required|objectId",
      reason: "string"
    }
  }
}

module.exports = MovementsCancel
