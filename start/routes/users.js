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

  }).prefix('/api/users')
    .middleware('auth')
    .namespace('Api')
}
