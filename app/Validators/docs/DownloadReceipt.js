'use strict'
const {WhitelistValidator} = require("../WhitelistValidator")

class DownloadReceipt extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "required|objectId",
      type: "required|in:movement,request",
    }
  }
}

module.exports = DownloadReceipt
