'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')

class UserRead extends WhitelistValidator {
  get includeParams () {
    return true
  }
  
  get rules () {
    return {
      'f': 'required'
    }
  }
}

module.exports = UserRead
