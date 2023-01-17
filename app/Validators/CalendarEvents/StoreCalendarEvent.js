'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')

class StoreCalendarEvent extends WhitelistValidator {
  get rules () {
    return {
      'name': 'required|string',
      'notes': 'string',
      'timed': 'boolean',
      'start': 'required|date',
      'end': 'required|date',
      'categoryId': 'objectId',
      'place': 'string',
      'userId': 'objectId',
      'clientId': 'objectId'
    }
  }
}

module.exports = StoreCalendarEvent
