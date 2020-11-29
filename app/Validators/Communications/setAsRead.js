'use strict'

class SetAsRead {
  get rules() {
    return {
      "ids": "required|array",
    }
  }
}

module.exports = SetAsRead
