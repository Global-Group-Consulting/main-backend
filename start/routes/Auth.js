module.exports = function (Route) {
  Route.group(() => {
    Route
      .post('/login', 'AuthController.login')
      .middleware('guest')
      .validator('Auth/login')

    Route
      .get('/user', 'AuthController.user')
      .middleware('auth')

    Route
      .post('/refresh', 'AuthController.refresh')

    Route
      .post('/activate', 'AuthController.activate')
      .middleware('guest')
      .validator('Auth/activate')

    Route
      .post('/forgot', 'AuthController.forgot')
      .middleware('guest')
    // .validator('Auth/AuthVerify')

    Route
      .post('/resetPassword', 'AuthController.resetPassword')
      .middleware('guest')
    // .validator('Auth/AuthVerify')

    Route
      .delete('/logout', 'AuthController.logout')
      .middleware('auth')
  }).prefix('/api/auth')
    .namespace('Api')
}
