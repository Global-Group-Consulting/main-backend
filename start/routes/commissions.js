module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', "CommissionController.read")

    Route.post('/newDeposit', "CommissionController.addNewDepositCommission")
    Route.post('/totalDeposit', "CommissionController.addExistingDepositCommission")

    Route.post('/collect', "CommissionController.collectCommissions")
    Route.post('/reinvest', "CommissionController.reinvestCommissions")
    Route.post('/blockCommissionsToReinvest', "CommissionController.blockCommissionsToReinvest")

    Route.get('/status/:id?', "CommissionController.getStatus")

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
