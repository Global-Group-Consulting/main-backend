'use strict'

class UpdateCalendarEvent {
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

module.exports = UpdateCalendarEvent
