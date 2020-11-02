module.exports = function (Route) {
  Route.group(() => {
    Route.post('/add', 'UserController.add')
      .validator('User')

    Route.get('/me', 'UserController.me')

    Route.get('/:id', 'UserController.show')

    Route.get('/', 'UserController.getAll')
  }).prefix('/api/users')
    .middleware('auth')
    .namespace('Api')
}
