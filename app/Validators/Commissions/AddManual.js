'use strict'

const {WhitelistValidator} = require("../WhitelistValidator")


class AddManual extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "required|objectId",
      amountChange: "required|number",
      commissionType: "required|string",
      notes: "required",
      amountAvailable: "number",
      referenceAgent: "string"
    }
  }
}

module.exports = AddManual
