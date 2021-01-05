'use strict'

const {WhitelistValidator} = require("../WhitelistValidator")

/** @typedef {import("../../../@types/Request").Request} RequestModel} */

const rules = {
  amount: "required|number",
  userId: "required|objectId",
  type: "required|number",
  wallet: "required|number",
  currency: "required|number",
  iban: "string",
  clubCardNumber: "number",
  typeClub: "string",
  notes: "string"
}

class requestsCreate extends WhitelistValidator {
  /**
   * @returns {RequestModel}
   */
  get rules() {
    return rules
  }
}

exports.rules = rules
module.exports = requestsCreate
