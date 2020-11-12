module.exports = function (Route) {
  Route.group(() => {
    Route
      .get('/', 'RequestController.readAll')

    Route
      .post('/', 'RequestController.create')

    Route
      .put('/:id', 'RequestController.update')
      .validator("requests/update")

    Route
      .get('/:id', 'RequestController.read')

    Route
      .delete('/:id', 'RequestController.delete')


  }).prefix('/api/requests')
    .namespace('Api')
}