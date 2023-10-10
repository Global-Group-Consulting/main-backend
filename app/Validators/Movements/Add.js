'use strict'

const { WhitelistValidator } = require("../WhitelistValidator")


class MovementsAdd extends WhitelistValidator {
  get rules() {
    return {
      userId: "required|idExists",
      movementType: "required|number|validMovement",
      amountChange: "required|number",
      created_at: "date",
      notes: "string",
      createdBy: "string",
      requestType: "number",
      requestId: "string",
      interestPercentage: "number",
      approved: "boolean",
    }
  }
}

module.exports = MovementsAdd
