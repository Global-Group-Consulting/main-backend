'use strict'

class UserDelete {
  get data () {
    return this.ctx.params
  }

  get rules () {
    return {
      'id': 'required|idExists'
    }
  }
}

module.exports = UserDelete
