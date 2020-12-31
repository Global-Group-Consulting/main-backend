module.exports = function (Route) {
  Route.group(() => {
    Route.get('/receipt/deposit', 'DocController.getReceiptDeposit')

  }).prefix('/api/docs')
    .middleware('auth')
    .namespace('Api')
}
