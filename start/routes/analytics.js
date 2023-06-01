module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'AnalyticsController.read')
    Route.post('/', 'AnalyticsController.store')
    
  }).prefix('/api/analytics')
    .middleware('auth')
    .namespace('Api')
}
