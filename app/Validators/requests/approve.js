const {WhitelistValidator} = require("../WhitelistValidator")

class requestsDelete extends WhitelistValidator {
  get includeParams() {
    return true
  }

  get rules() {
    return {
      id: "objectId|required",
      paymentDocDate: "required|date",
      paymentAmount: "number",
      paymentGoldAmount: "number",
    }
  }
}

module.exports = requestsDelete
