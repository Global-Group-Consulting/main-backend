module.exports = function (Route) {
  Route.group(() => {
    Route.any('/club', 'ProxyController.club')

  }).prefix('/api/external')
    .middleware('auth')
    .namespace('Api')
}
