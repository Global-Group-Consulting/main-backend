'use strict'

const UseRoles = require("../../../enums/UserRoles")

const requiredForUsers = `required_when:role,${UseRoles.CLIENTE}|required_when:role,${UseRoles.CLIENTE}`

class UserUpdate {
  get data() {

    return Object.assign({}, this.ctx.request.body, this.ctx.params)
  }

  get rules() {
    return {
      id: 'required|idExists',
      email: 'email',
      contractPercentage: `${requiredForUsers}|number`,
      contractInitialInvestment: `${requiredForUsers}|number`,
    }
  }
}

module.exports = UserUpdate
