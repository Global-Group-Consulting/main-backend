'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')

class UpsertCalendarCategory extends WhitelistValidator {
  get rules () {
    return {
      name: 'string|required',
      color: 'string|required'
    }
  }
}

module.exports = UpsertCalendarCategory
