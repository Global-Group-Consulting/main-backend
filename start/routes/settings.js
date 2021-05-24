module.exports = function (Route) {
  Route.group(() => {

    Route.get('/', 'SettingController.readAll')
    Route.get('/:id', 'SettingController.readForUser')

    Route.post('/', 'SettingController.upsertAll')
    Route.post('/:id', 'SettingController.upsertForUser')

  }).prefix('/api/settings')
    .middleware('auth')
    .namespace('Api')
}
