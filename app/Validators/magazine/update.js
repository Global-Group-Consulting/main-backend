'use strict'

class Update {
  get rules() {
    return {
      title: 'required',
      publicationDate: 'required|string',
      showRange: 'required|array',
    }
  }
}

module.exports = Update
