module.exports = function (Route) {
  Route.group(() => {
    Route.get('/:id/meta', 'FileController.show')

    Route.get('/:id', 'FileController.download')

    Route.delete('/', 'FileController.deleteBulk')

    Route.delete('/:id', 'FileController.delete')


    // Only for testing purposes
    /*Route
      .post('/', 'FileController.upload')*/


  }).prefix('/api/files')
    .middleware("auth")
    .namespace('Api')
}
