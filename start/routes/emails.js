module.exports = function (Route) {
  Route.group(() => {
    Route
      .post('/userCreated', 'EmailController.sendUserCreated')

    Route
      .post('/passwordForgot', 'EmailController.sendPasswordForgot')

    Route
      .post('/passwordRecovered', 'EmailController.sendPasswordRecovered')
  }).prefix('/api/emails')
    .namespace('Api')
}
