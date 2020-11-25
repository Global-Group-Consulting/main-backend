module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', "MovementController.read")

    Route.get('/status/:id?', "MovementController.currentStatus")

    Route.get('/:id', "MovementController.read")
      .validator("Movements/Read")

    Route.post('/', 'MovementController.add')
      .validator("Movements/Add")

    Route.post('/import', 'MovementController.import')

    Route.post('/:id', 'MovementController.cancel')
      .validator("Movements/Cancel")

  }).prefix('/api/movements')
    .middleware('auth')
    .namespace('Api')
}
