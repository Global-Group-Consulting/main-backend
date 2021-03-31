module.exports = function (Route) {
  Route.group(() => {
    Route.get('/users', 'BriteController.readUsers')

    Route.get('/:id', 'BriteController.read')
      .validator('App/Validators/Club/Read')

    Route.get('/:id/blocks', 'BriteController.getBlocksData')
      .validator('App/Validators/Club/Read')

    Route.post('/:id', 'BriteController.manualAdd')
      .validator('App/Validators/Club/ManualAdd')

    Route.post('/:id/use', 'BriteController.use')
      .validator('App/Validators/Club/Use')

    Route.post('/:id/remove', 'BriteController.remove')
      .validator('App/Validators/Club/Remove')

    Route.put('/:id', 'BriteController.update')
      .validator('App/Validators/Club/Update')

    Route.delete('/:id', 'BriteController.delete')
      .validator('App/Validators/Club/Read')

  }).prefix('/api/club')
    .middleware('auth')
    .namespace('Api')
}
