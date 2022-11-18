
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/systemTotals', 'StatisticsController.getSystemTotals')
    Route.get('/commissionTotals', 'StatisticsController.getCommissionTotals')
    Route.get('/userStatuses', 'StatisticsController.getUserStatuses')
    Route.get('/newUsersCount', 'StatisticsController.getNewUsersCount')
    Route.get('/agents/newUsersCount', 'StatisticsController.getAgentNewUsersCount')
    Route.get('/agents/newDepositsCount', 'StatisticsController.getAgentNewDepositsCount')
    Route.get('/refundReport', 'StatisticsController.getRefundReport')
    Route.get('/withdrawalDepositReport', 'StatisticsController.getWithdrawalDepositReport')
    Route.get('/withdrawalInterestReport', 'StatisticsController.getWithdrawalInterestReport')
  })
    .prefix('/api/statistics')
    .middleware('authAdmin')
    .namespace('Api')
}
