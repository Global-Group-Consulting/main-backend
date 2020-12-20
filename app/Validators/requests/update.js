'use strict'

const { WhitelistValidator } = require("../WhitelistValidator")

/** @typedef {import("../../../@types/Request").Request} RequestModel} */

class requestsUpdate extends WhitelistValidator {
  get includeParams() {
    return true
  }

  /**
   * @returns {RequestModel}
   */
  get rules() {
    return {
      id: "required|objectId",
      amount: "required",
      contractNumber: "required",
      type: "required",
    }
  }

}

module.exports = requestsUpdate
