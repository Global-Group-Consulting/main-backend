'use strict'

const { WhitelistValidator } = require('../WhitelistValidator')
const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')

class UpsertCalendarCategory extends WhitelistValidator {
  async authorize () {
    
    if (!this.ctx.auth.user.isAdmin()) {
      throw new AclForbiddenException('You don\'t have permission to access this resource')
    }
    
    return true
  }
  
  get rules () {
    return {
      name: 'string|required',
      color: 'string|required'
    }
  }
}

module.exports = UpsertCalendarCategory
