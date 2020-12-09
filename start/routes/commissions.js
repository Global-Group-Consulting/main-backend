module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', "CommissionController.read")

    Route.post('/newDeposit', "CommissionController.addNewDepositCommission")

    /* Route.get('/status/:id?', "CommissionsController.currentStatus")

     Route.get('/:id', "CommissionsController.read")
       .validator("Movements/Read")

     Route.post('/', 'CommissionsController.add')
       .validator("Movements/Add")

 */
  }).prefix('/api/commissions')
    .middleware('auth')
    .namespace('Api')
}
