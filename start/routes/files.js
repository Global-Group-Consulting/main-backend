module.exports = function (Route) {
  Route.group(() => {
    Route
      .get('/:id', 'FileController.download')

    Route
      .delete('/:id', 'FileController.delete')


  }).prefix('/api/files')
    .namespace('Api')
}
