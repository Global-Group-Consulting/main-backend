'use strict'

/** @typedef {import("../../../@types/Brite/Brite").Brite} Brite */

const {WhitelistValidator} = require("../WhitelistValidator")


class Use extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "required|objectId",
      amountChange: "required|number",
      notes: "required|string",
      semesterId: "required|string",
    }
  }
}

module.exports = Use
