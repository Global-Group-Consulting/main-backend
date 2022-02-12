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
  
  }
}

module.exports = QueueProvider
