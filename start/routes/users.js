module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'UserController.getAll')

    Route.get('/me', 'UserController.me')

    /*
    CRUD Actions
     */

    Route.post('/', 'UserController.create')
      .validator('users/UserCreate')

    Route.get('/:id', 'UserController.read')
      .validator('users/UserRead')

    Route.patch('/:id', 'UserController.update')
      .validator('users/UserUpdate')

    Route.delete('/:id', 'UserController.delete')
      .validator('users/UserDelete')
      .middleware("authSuperAdmin")

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
  
    Route.get('/:id/deposit', 'UserController.getDeposit')
  
    /* Route.post('/:id/status', 'UserController.changeStatus')
       .validator('users/UserChangeStatus')
       .middleware("authSuperAdmin")*/
  
  
  }).prefix('/api/users')
    .middleware('auth')
    .namespace('Api')
}
