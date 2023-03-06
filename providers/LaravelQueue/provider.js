'use strict'

const {ServiceProvider, ioc} = require('@adonisjs/fold')

const Helpers = use("Helpers")

class QueueProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    ioc.singleton('LaravelQueueProvider', (app) => {
      const Config = app.use('Adonis/Src/Config')

      return new (require("./index"))(Config.get("laravelQueue"))
    })
  }
  
  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    if (!Helpers.isAceCommand()) {
    
      /**
       * I import it where so that the provider can start immediately
       *
       * @type {import('./index')}
       * */
      const LaravelQueueProvider = this.app.use('LaravelQueueProvider')
    
      LaravelQueueProvider.ping()
    }
  }
}

module.exports = QueueProvider
