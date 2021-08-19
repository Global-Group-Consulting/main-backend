module.exports = function (Route) {
  Route.group(() => {
    Route.get('/users', 'FilterController.fetchUsersList')
    Route.get('/agents', 'FilterController.fetchAgentsList')


  }).prefix('/api/filters')
    .middleware('auth', 'authAdmin')
    .namespace('Api')
}
