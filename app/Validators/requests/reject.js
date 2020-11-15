const { WhitelistValidator } = require("../WhitelistValidator")

class requestsReject extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "objectId|required",
      reason: "required|string"
    }
  }
}

module.exports = requestsReject