'use strict'

const { WhitelistValidator } = require("../WhitelistValidator")

/** @typedef {import("../../../@types/Request").Request} RequestModel} */

class requestsCreate extends WhitelistValidator {
  get includeParams() {
    return true
  }

  /** 
   * @returns {RequestModel} 
   */
  get rules() {
    return {
      amount: "required",
      contractNumber: "required",
      type: "required",
    }
  }

}

module.exports = requestsCreate
