module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'CommunicationController.readAll')
    Route.get('/receivers', 'CommunicationController.readAllReceivers')

    Route.get('/conversations/:id', 'CommunicationController.readConversationMessages')

    Route.patch('/messages', 'CommunicationController.setAsRead')
      .validator("App/Validators/Communications/setAsRead")

    Route.post("/", 'CommunicationController.create')
      .validator("App/Validators/Communications/create")

  }).prefix('/api/communications')
    .middleware('auth')
    .namespace('Api')
}
