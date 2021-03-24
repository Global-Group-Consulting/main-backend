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
      notes: "required",
    }
  }
}

module.exports = AddManual
