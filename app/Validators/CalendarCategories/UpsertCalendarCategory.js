'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')
const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')

class UpsertCalendarCategory extends WhitelistValidator {
  async authorize () {
    // Only admins can create or update calendar categories
    if (!this.ctx.auth.user.isAdmin()) {
      throw new AclForbiddenException()
    }
    
    return true
  }
  
  get rules () {
    return {
      name: 'string|required',
      color: 'string|required',
      visibility: 'string|required'
    }
  }
}

module.exports = UpsertCalendarCategory
