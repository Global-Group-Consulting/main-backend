module.exports = function (Route) {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')

    Route.get('/verifyEmail', 'AuthController.verifyEmail')

    Route.post('/forgotPassword', 'AuthController.forgotPassword')

    Route.post('/reset', 'AuthController.reset')

    Route.post('/logout', 'AuthController.logout')
      .middleware('auth')
  }).prefix('/auth')

}
