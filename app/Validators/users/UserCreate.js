'use strict'

class UserCreate {
  get rules () {
    return {
      email: 'required|email|unique:users',
      firstName: 'required',
      lastName: 'required',
    }
  }

  // TODO:// format email to lowercase to avoid uppercase errors
}

module.exports = UserCreate
