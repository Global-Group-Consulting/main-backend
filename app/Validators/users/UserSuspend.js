'use strict'

class UserApprove {
  get data() {
    return Object.assign({}, this.ctx.request.body, this.ctx.params)
  }

  get rules() {
    return {
      'id': 'required|idExists',
      'status': 'required|boolean'
    }
  }
}

module.exports = UserApprove
