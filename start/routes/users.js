const { setAclMiddleware } = require('../../app/Helpers/Acl')
const { UsersPermissions } = require('../../app/Helpers/Acl/enums/users.permissions')
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'UserController.getFiltered')
    Route.get('/select/agents', 'UserController.getSelectOptions')
    /*Route.get('/', 'UserController.getAll')
      .validator('users/UserReadAll')*/
    
    Route.get('/me', 'UserController.me')
    Route.get('/count', 'UserController.getCounters')
    Route.get('/statistics', 'UserController.getStatistics')
      .validator('users/UserReadStatistics')
    
    /*
    CRUD Actions
     */
     
    Route.post('/', 'UserController.create')
      .validator('users/UserCreate')
      .middleware(setAclMiddleware([UsersPermissions.ACL_USERS_TEAM_WRITE, UsersPermissions.ACL_USERS_ALL_WRITE]))
    
    Route.get('/:id', 'UserController.read')
      .validator('users/UserRead')
      .middleware(setAclMiddleware([UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ]))
    
    Route.patch('/:id', 'UserController.update')
      .validator('users/UserUpdate')
    
    Route.delete('/:id', 'UserController.delete')
      .validator('users/UserDelete')
      .middleware('authSuperAdmin')
    
    Route.put('/:id/approve', 'UserController.approve')
      .validator('users/UserApprove')
    
    Route.patch('/:id/suspend', 'UserController.suspend')
      .validator('users/UserSuspend')
    
    Route.post('/:id/sendEmailActivation', 'UserController.sendActivationEmail')
    // .validator('users/UserApprove')
    
    Route.post('/:id/confirmDraft', 'UserController.confirmDraft')
    Route.post('/:id/incomplete', 'UserController.incomplete')
    Route.post('/:id/validate', 'UserController.validate')
    Route.post('/:id/importContract', 'UserController.importContract')
    
    Route.get('/:id/clientsList', 'UserController.getClientsList')
      .validator('users/UserRead')
    
    Route.post('/:id/resendContract', 'UserController.resendContract')
    Route.get('/:id/contractLogs', 'UserController.getSignRequestLogs')
    Route.patch('/:id/restoreSignedContract', 'UserController.restoreSignedContract')
    
    Route.get('/:id/deposit', 'UserController.getDeposit')
    
    /* Route.post('/:id/status', 'UserController.changeStatus')
       .validator('users/UserChangeStatus')
       .middleware("authSuperAdmin")*/
    
  }).prefix('/api/users')
    .middleware('auth')
    .namespace('Api')
}
