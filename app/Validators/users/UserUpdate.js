'use strict'

class UserUpdate {
  get data() {

    return Object.assign({}, this.ctx.request.body, this.ctx.params)
  }

  get rules() {
    return {
      id: 'required|idExists',
      email: 'required',
      contractPercentage: "required|number",
      contractInitialInvestment: "number"
    }
  }
}

module.exports = UserUpdate
