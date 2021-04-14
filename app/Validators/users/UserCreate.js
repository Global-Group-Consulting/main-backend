'use strict'

const UseRoles = require("../../../enums/UserRoles")

const requiredForUsers = `required_when:role,${UseRoles.CLIENTE}|required_when:role,${UseRoles.AGENTE}`
class UserCreate {
  get rules() {
    return {
      email: 'required|email|unique:users',
      firstName: 'required',
      lastName: 'required',
      contractPercentage: `${requiredForUsers}|number`,
      role: 'number',
    }
  }

  // TODO:// format email to lowercase to avoid uppercase errors
}

module.exports = UserCreate
