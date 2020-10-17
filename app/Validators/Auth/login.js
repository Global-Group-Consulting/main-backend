'use strict'

class authAuthLogin {
  get rules () {
    return {
      email: 'required|email',
      password: 'required '
    }
  }
}

module.exports = authAuthLogin
