module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', "CommissionController.read")

    Route.post('/newDeposit', "CommissionController.addNewDepositCommission")
    Route.post('/totalDeposit', "CommissionController.addExistingDepositCommission")

    Route.post('/collect', "CommissionController.collectCommissions")
    Route.post('/reinvest', "CommissionController.reinvestCommissions")
    Route.post('/blockCommissionsToReinvest', "CommissionController.blockCommissionsToReinvest")

    Route.get('/status/:id?', "CommissionController.getStatus")
    Route.get('/available/:id?', "CommissionController.getAvailable")
    Route.get('/list/:id?', "CommissionController.getList")

    Route.post('/:id/add', "CommissionController.manualAdd")
      .validator("Commissions/AddManual")
    Route.post('/:id/cancellation', "CommissionController.manualCancellation")
      .validator("Commissions/AddManual")

    /*
     Route.get('/:id', "CommissionsController.read")
       .validator("Movements/Read")

     Route.post('/', 'CommissionsController.add')
       .validator("Movements/Add")

 */
  }).prefix('/api/commissions')
    .middleware('auth')
    .namespace('Api')
}
