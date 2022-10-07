'use strict'

const {WhitelistValidator} = require("../WhitelistValidator")


class CreateManual extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      // id: "required|objectId",
      amountChange: "required|number",
      commissionType: "required|string",
      created_at: "required|date",
      movementId: "string",
      notes: "string",
      clientId: "string",
      commissionOnValue: "number",
      commissionPercentage: "number",
      dateReference: "date",
    }
  }
}

module.exports = CreateManual
