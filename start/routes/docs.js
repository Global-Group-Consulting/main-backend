module.exports = function (Route) {
  Route.group(() => {
    Route.get('/receipt/deposit', 'DocController.getReceiptDeposit')
    Route.get('/reports/requests', 'DocController.getRequestsReport')

  }).prefix('/api/docs')
    .middleware('auth')
    .namespace('Api')
}
