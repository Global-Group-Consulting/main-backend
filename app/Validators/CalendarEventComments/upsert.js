'use strict'

class CalendarEventCommentsUpsert {
  get rules () {
    return {
      message: 'required|string|min:1'
    }
  }
}

module.exports = CalendarEventCommentsUpsert
