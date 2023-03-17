'use strict'

class usersUserReplaceContract {
  get rules () {
    return {
      file: 'required|file:pdf',
      maintainOld: 'boolean'
    }
  }
}

module.exports = usersUserReplaceContract
