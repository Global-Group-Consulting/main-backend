const { setAclMiddleware } = require('../../app/Helpers/Acl')
const { UsersPermissions } = require('../../app/Helpers/Acl/enums/users.permissions')
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/agents', 'SelectOptionController.getAgentsList')
      .middleware(setAclMiddleware([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ]))
    Route.get('/users', 'SelectOptionController.getUsersList')
      .middleware(setAclMiddleware([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ]))
  })
    .prefix('/api/selectOptions')
    .middleware('auth')
    .namespace('Api')
}
