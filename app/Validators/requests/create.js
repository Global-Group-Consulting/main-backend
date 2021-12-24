'use strict'

/** @typedef {import("../../../@types/Request").Request} RequestModel} */

const {WhitelistValidator} = require("../WhitelistValidator")

const rules = {
  amount: "required",
  goldAmount: "number",
  userId: "required|objectId",
  type: "required|number",
  wallet: "required|number",
  currency: "required|number",
  iban: "string",
  clubCardNumber: "string",
  typeClub: "string",
  notes: "string",
  autoWithdrawlAll: "boolean",
  autoWithdrawlAllRecursively: "boolean",
  cards: "array"
}

class requestsCreate extends WhitelistValidator {
  /**
   * @returns {RequestModel}
   */
  get rules() {
    return rules
  }

  get sanitizationRules() {
    return {
      amount: "to_float",
      goldAmount: "to_float",
      type: "to_int",
      wallet: "to_int",
      currency: "to_int",
      autoWithdrawlAll: "to_boolean",
      autoWithdrawlAllRecursively: "to_boolean",
    }
  }
}

exports.rules = rules
module.exports = requestsCreate
