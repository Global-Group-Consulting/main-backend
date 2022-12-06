'use strict'

const {WhitelistValidator} = require("../WhitelistValidator")

/** @typedef {import("../../../@types/Request").Request} RequestModel} */

const rules = {
  amount: "required",
  userId: "required|objectId",
  type: "required|number",
  wallet: "required|number",
  currency: "required|number",
  iban: "string",
  clubCardNumber: "string",
  typeClub: "string",
  notes: "string",
  clubRepayment: "boolean",
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
