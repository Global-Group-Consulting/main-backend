module.exports = function (Route) {
  Route.group(() => {
    Route
      .get('/:id', 'FileController.download')

    Route
      .delete('/:id', 'FileController.delete')

    // Only for testing purposes
    /*Route
      .post('/', 'FileController.upload')*/


  }).prefix('/api/files')
    .namespace('Api')
    .middleware("auth")
}
