'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')

class IndexCalendarEvent extends WhitelistValidator {
  get rules () {
    return {
      start: 'date|required',
      end: 'date|required'
    }
  }
}

module.exports = IndexCalendarEvent
