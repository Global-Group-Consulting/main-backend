module.exports = function (Route) {
  /**
   * Permissions
   */
  Route.group(() => {
    Route.get('/', 'AclPermissionsController.readAll')
    Route.get('/:id', 'AclPermissionsController.read')
      .validator('App/Validators/Acl/Read')

    Route.post('/', 'AclPermissionsController.create')
      .validator('App/Validators/Acl/CreatePermission')

    Route.put('/:id', 'AclPermissionsController.update')
      .validator('App/Validators/Acl/UpdatePermission')

    Route.delete('/:id', 'AclPermissionsController.delete')
      .validator('App/Validators/Acl/Read')

  }).prefix('/api/acl/permissions')
    .middleware('auth', "authSuperAdmin")
    .namespace('Api')

  /**
   * Roles
   */
  Route.group(() => {
    Route.get('/', 'AclRolesController.readAll')
    Route.get('/:id', 'AclRolesController.read')
      .validator('App/Validators/Acl/Read')

    Route.post('/', 'AclRolesController.create')
      .validator('App/Validators/Acl/CreateRole')

    Route.put('/:id', 'AclRolesController.update')
      .validator('App/Validators/Acl/UpdateRole')

    Route.delete('/:id', 'AclRolesController.delete')
      .validator('App/Validators/Acl/Read')

  }).prefix('/api/acl/roles')
    .middleware('auth', "authSuperAdmin")
    .namespace('Api')
}
