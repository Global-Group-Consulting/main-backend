'use strict'

class StoreCalendarCategory {
  get rules () {
    return {
      name: 'string|required',
      color: 'string|required'
    }
  }
}

module.exports = StoreCalendarCategory
