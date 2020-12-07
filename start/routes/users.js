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

    Route.post('/:id/sendEmailActivation', 'UserController.sendActivationEmail')
    // .validator('users/UserApprove')

    Route.post('/:id/confirmDraft', 'UserController.confirmDraft')
    Route.post('/:id/incomplete', 'UserController.incomplete')
    Route.post('/:id/validate', 'UserController.validate')

    Route.post('/:id/status', 'UserController.changeStatus')
      .validator('users/UserChangeStatus')
      .middleware("authSuperAdmin")


  }).prefix('/api/users')
    .middleware('auth')
    .namespace('Api')
}
