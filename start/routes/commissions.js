module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', "CommissionController.read")

    Route.post('/newDeposit', "CommissionController.addNewDepositCommission")
    Route.post('/onDeposit', "CommissionController.addExistingDepositCommission")
    Route.post('/reinvest', "CommissionController.reinvestCommissions")
    Route.post('/collect', "CommissionController.collectCommissions")

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
