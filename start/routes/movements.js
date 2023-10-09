module.exports = function (Route) {
  Route.group(() => {
    // Route.get('/', "MovementController.readAll")

    Route.get('/status/:id?', "MovementController.currentStatus")

    // Route.get('/list/:id?', "MovementController.getList")

    Route.get('/:id?', "MovementController.readAll")
      .validator("Movements/Read")

    Route.post('/', 'MovementController.add')
      .validator("Movements/Add")

    Route.post('/import', 'MovementController.import')

    Route.post('/:id/update', 'MovementController.update')

    Route.post('/:id', 'MovementController.cancel')
      .validator("Movements/Cancel")

    Route.delete('/:id', 'MovementController.delete')

  }).prefix('/api/movements')
    .middleware('auth')
    .namespace('Api')
}
