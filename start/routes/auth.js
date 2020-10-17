module.exports = function (Route) {
  Route.group(() => {
    Route
      .post('/login', 'AuthController.login')
      .validator('Auth/login')

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
      .post('/logout', 'AuthController.logout')
      .middleware('auth')
  }).prefix('/api/Auth')
    .namespace('Api')
}
