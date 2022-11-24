module.exports = function (Route) {
  Route.group(() => {
    Route.get('/systemTotalsIn', 'StatisticsController.getSystemTotalsIn')
    Route.get('/systemTotalsOut', 'StatisticsController.getSystemTotalsOut')
    Route.get('/commissionTotals', 'StatisticsController.getCommissionTotals')
    Route.get('/userStatuses', 'StatisticsController.getUserStatuses')
    Route.get('/newUsersCount', 'StatisticsController.getNewUsersCount')
    Route.get('/agents/newUsersCount', 'StatisticsController.getAgentNewUsersCount')
    Route.get('/agents/newDepositsCount', 'StatisticsController.getAgentNewDepositsCount')
    Route.get('/refundReport', 'StatisticsController.getRefundReport')
    Route.get('/withdrawalDepositReport', 'StatisticsController.getWithdrawalDepositReport')
    Route.get('/withdrawalInterestReport', 'StatisticsController.getWithdrawalInterestReport')
    
    Route.post('/movements/refresh', 'StatisticsController.movementsRefresh')
      .validator('Statistics/Movements/RefreshRequest')
  })
    .prefix('/api/statistics')
    .middleware('authAdmin')
    .namespace('Api')
}
