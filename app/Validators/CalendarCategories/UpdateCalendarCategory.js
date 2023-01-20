'use strict'

class UpdateCalendarCategory {
  get rules () {
    return {
      name: 'string|required',
      color: 'string|required'
    }
  }
}

module.exports = UpdateCalendarCategory
