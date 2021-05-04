'use strict'

const {ServiceProvider} = require('@adonisjs/fold')

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
    this.app.singleton('QueueProvider', () => {
      const Config = this.app.use('Adonis/Src/Config')

      return new (require('.'))(Config)
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
       * @type {import("./index")}
       * */
      const QueueProvider = this.app.use("QueueProvider")

      QueueProvider.initRecursiveJobs()
    }
  }
}

module.exports = QueueProvider
