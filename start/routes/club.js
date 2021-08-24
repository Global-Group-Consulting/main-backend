const {setAclMiddleware} = require("../../app/Helpers/Acl");
const {ClubPermissions} = require("../../app/Helpers/Acl/enums/club.permissions");

module.exports = function (Route) {
  Route.group(() => {
    Route.get('/users', 'BriteController.readUsers')

    Route.get('/dashboard/semesters', 'ClubController.dashboardSemesters')
      .middleware(setAclMiddleware(ClubPermissions.CLUB_READ))

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
