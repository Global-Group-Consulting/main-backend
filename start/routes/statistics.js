
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/systemTotals', 'StatisticsController.getSystemTotals')
    Route.get('/commissionTotals', 'StatisticsController.getCommissionTotals')
  })
    .prefix('/api/statistics')
    .middleware('authAdmin')
    .namespace('Api')
}
