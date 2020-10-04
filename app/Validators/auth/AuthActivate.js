'use strict'

class AuthActivate {
  get rules () {
    return {
      token: 'required',
      password: 'required|confirmed'
    }
  }
}

module.exports = AuthActivate
