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
      amount: "required|number",
      notes: "required|string",
    }
  }
}

module.exports = Use
