module.exports = function (Route) {
  Route.group(() => {
    Route.get('/agents', 'SelectOptionController.getAgentsList')
    Route.get('/users', 'SelectOptionController.getUsersList')
  })
    .prefix('/api/selectOptions')
    .middleware('auth')
    .namespace('Api')
}
