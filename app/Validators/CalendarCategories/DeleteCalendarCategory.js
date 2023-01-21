'use strict'

const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')
class DeleteCalendarCategory {
  async authorize () {
    
    if (!this.ctx.auth.user.isAdmin()) {
      throw new AclForbiddenException('You don\'t have permission to access this resource')
    }
    
    return true
  }
  
  get rules () {
    return {
      // validation rules
    }
  }
}

module.exports = DeleteCalendarCategory
