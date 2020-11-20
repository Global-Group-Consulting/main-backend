'use strict'

const { WhitelistValidator } = require("../WhitelistValidator")


class MovementsAdd extends WhitelistValidator {
  get rules() {
    return {
      userId: "required|idExists",
      movementType: "required|number|validMovement",
      amountChange: "required|number"
    }
  }
}

module.exports = MovementsAdd
