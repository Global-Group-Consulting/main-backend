module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'AgentBriteController.index')
    //Route.post('/', 'AgentBriteController.store')

    Route.get('/statistics/:id?', 'AgentBriteController.statistics')

    Route.patch('/add/:id', 'AgentBriteController.add')
    Route.patch('/remove/:id', 'AgentBriteController.remove')

  }).prefix('/api/agentBrites')
    .middleware('auth')
    .namespace('Api')
}
