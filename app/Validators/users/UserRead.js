'use strict'

class UserRead {
  get data () {
    return this.ctx.params
  }

  get rules () {
    return {
      'id': 'required|idExists'
    }
  }
}

module.exports = UserRead
