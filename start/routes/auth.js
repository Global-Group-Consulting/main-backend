module.exports = function (Route) {
  Route.group(() => {
    Route
      .post('/login', 'AuthController.login')

    Route
      .post('/activate', 'AuthController.activate')
      .validator('auth/AuthActivate')

    Route
      .post('/forgot', 'AuthController.forgot')
    // .validator('auth/AuthVerify')

    Route
      .post('/resetPassword', 'AuthController.resetPassword')
    // .validator('auth/AuthVerify')

    Route
      .post('/logout', 'AuthController.logout')
    // .middleware('auth')
  }).prefix('/api/auth')
    .namespace('Api')
}
