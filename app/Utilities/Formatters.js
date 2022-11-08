const UserRoles = require('../../enums/UserRoles')

/**
 *
 * @param {User} user
 */
module.exports.accountStatus = function (user) {
  if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+user.role)) {
    return ''
  }
  
  if (user.contractImported) {
    return 'Importato'
  }
  
  if (user.contractSignedAt) {
    return 'Firmato'
  }
  
  return 'Da firmare'
}
