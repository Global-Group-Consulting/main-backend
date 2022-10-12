module.exports = function (Route) {
  Route.group(() => {
    Route.get('/receipt/deposit', 'DocController.getReceiptDeposit')
      .validator("docs/DownloadReceipt")

    Route.get('/reports/requests', 'DocController.getRequestsReport')
    
    Route.get('/reports/movements', 'DocController.getMovementsReport')

  }).prefix('/api/docs')
    .middleware('auth')
    .namespace('Api')
}
