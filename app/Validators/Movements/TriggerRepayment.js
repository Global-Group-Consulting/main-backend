'use strict'

const {WhitelistValidator} = require("../WhitelistValidator")


class MovementsAdd extends WhitelistValidator {
  get rules() {
    return {
      userId: "required|idExists",
      amount: "required|number",
      notes: "required|string",
      app: "string|in:main,club",
    }
  }
}

module.exports = MovementsAdd
