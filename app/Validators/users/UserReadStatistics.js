'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')

class UserReadStatistics extends WhitelistValidator {
  get includeParams () {
    return true
  }
  
  get rules () {
    return {
      type: 'required|string'
    }
  }
}

module.exports = UserReadStatistics
