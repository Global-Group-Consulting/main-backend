module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'DashboardController.getByRole')
    Route.get('/:id', 'DashboardController.getByRole')

  }).prefix('/api/dashboards')
    .middleware('auth')
    .namespace('Api')
}
