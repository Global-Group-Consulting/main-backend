module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', "MovementController.read")

    Route.get('/status', "MovementController.currentStatus")

    Route.get('/:id', "MovementController.read")
      .validator("Movements/Read")

    Route.post('/', 'MovementController.add')
      .validator("Movements/Add")

    Route.post('/:id', 'MovementController.cancel')
      .validator("Movements/Cancel")

  }).prefix('/api/movements')
    .namespace('Api')
}
