module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'AgentBriteController.index')
    //Route.post('/', 'AgentBriteController.store')

    Route.get('/statistics', 'AgentBriteController.statistics')

  }).prefix('/api/agentBrites')
    .middleware('auth')
    .namespace('Api')
}
