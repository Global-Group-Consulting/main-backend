module.exports = function (Route) {
  Route.group(() => {
  Route.any('*', 'ProxyController.handle')

  }).prefix('/api/ext')
    .middleware('auth')
    .namespace('Api')
}
