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
      'userIds': 'objectId:allowArray',
      'clientId': 'objectId',
      'clientName': 'string',
      'returnDate': 'date'
    }
  }
}

module.exports = StoreCalendarEvent
