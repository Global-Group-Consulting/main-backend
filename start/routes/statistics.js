
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/systemTotals', 'StatisticsController.getSystemTotals')
    Route.get('/commissionTotals', 'StatisticsController.getCommissionTotals')
    Route.get('/userStatuses', 'StatisticsController.getUserStatuses')
    Route.get('/newUsersCount', 'StatisticsController.getNewUsersCount')
    Route.get('/agents/newUsersCount', 'StatisticsController.getAgentNewUsersCount')
    Route.get('/agents/newDepositsCount', 'StatisticsController.getAgentNewDepositsCount')
  })
    .prefix('/api/statistics')
    .middleware('authAdmin')
    .namespace('Api')
}
