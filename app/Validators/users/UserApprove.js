'use strict'

class UserApprove {
  get data() {
    return this.ctx.params
  }

  get rules() {
    return {
      'id': 'required|idExists'
    }
  }
}

module.exports = UserApprove
