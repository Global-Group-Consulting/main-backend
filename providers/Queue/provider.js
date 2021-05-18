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
    ioc.singleton('QueueProvider', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const Helpers = app.use("Helpers")
      const Logger = app.use("Logger")

      return new (require("./index"))(Config, Logger, Helpers)
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
    /*   if (!Helpers.isAceCommand()) {

         /!**
          * I import it where so that the provider can start immediately
          *
          * @type {import("./index")}
          * *!/
         /!*const QueueProvider = this.app.use("QueueProvider")

         QueueProvider.initRecursiveJobs()*!/
       }*/
  }
}

module.exports = QueueProvider
