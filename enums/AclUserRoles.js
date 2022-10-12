const {BasicEnum} = require('../classes/BasicEnum')

class AclUserRoles extends BasicEnum {
  constructor() {
    super('AclUserRoles')
    
    this.ADMIN = "admin";
    this.SUPER_ADMIN = "super_admin";
    this.CLIENTS_SERVICE = "clients_service";
    this.AGENT = "agent";
    this.CLIENT = "client";
    this.CLUB_ADMIN = "admin_club";
    
    this.data = {
      [this.ADMIN]: {id: "admin"},
      [this.SUPER_ADMIN]: {id: "super_admin"},
      [this.CLIENTS_SERVICE]: {id: "clients_service"},
      [this.AGENT]: {id: "agent"},
      [this.CLIENT]: {id: "client"},
      [this.CLUB_ADMIN]: {id: "admin_club"},
    }
  }
  
}

module.exports = new AclUserRoles()
