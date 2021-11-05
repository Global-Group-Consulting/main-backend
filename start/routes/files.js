module.exports = function (Route) {
  Route.group(() => {
    Route.get('/:id/meta', 'FileController.meta')

    Route.get('/:id', 'FileController.download')

    Route.delete('/', 'FileController.deleteBulk')

    Route.delete('/:id', 'FileController.delete')

    // Only for testing purposes
    /*Route
      .post('/', 'FileController.upload')*/


  }).prefix('/api/files')
    .namespace('Api')
    .middleware("auth")

  Route.get('/api/files/:id/show', 'Api/FileController.show');

}
