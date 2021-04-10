'use strict'

class UserRead {
  get data () {
    return this.ctx.params
  }

  get rules () {
    return {
      'id': 'required'
    }
  }
}

module.exports = UserRead
