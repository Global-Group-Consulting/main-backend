const { WhitelistValidator } = require("../WhitelistValidator")

class requestsDelete extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "objectId|required"
    }
  }
}

module.exports = requestsDelete