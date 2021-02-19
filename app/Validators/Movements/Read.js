'use strict'

const { WhitelistValidator } = require("../WhitelistValidator")

class MovementsRead extends WhitelistValidator {
  get includeParams() { return true }

  get rules() {
    return {
      id: "objectId",
    }
  }
}

module.exports = MovementsRead
