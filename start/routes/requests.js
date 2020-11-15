module.exports = function (Route) {
  Route.group(() => {
    Route
      .get('/', 'RequestController.readAll')

    Route
      .post('/', 'RequestController.create')
      .validator("requests/create")

    Route
      .put('/:id', 'RequestController.update')
      .validator("requests/update")

    Route
      .get('/:id', 'RequestController.read')

    Route
      .delete('/:id', 'RequestController.delete')
      .validator("requests/delete")

    Route
      .put('/:id/approve', 'RequestController.approve')
      .validator("requests/delete")

    Route
      .put('/:id/reject', 'RequestController.reject')
      .validator("requests/reject")

  }).prefix('/api/requests')
    .middleware('auth')
    .namespace('Api')
}