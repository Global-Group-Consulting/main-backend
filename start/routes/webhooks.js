module.exports = function (Route) {
  Route.group(() => {
    Route.post("signRequest", "WebhookController.onSignRequest")

  }).prefix('/api/webhooks')
    .namespace('Api')
}
