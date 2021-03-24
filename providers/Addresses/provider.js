'use strict'

const {ServiceProvider} = require('@adonisjs/fold')

class AddressesProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('AddressesProvider', () => {
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
    /*/!**
     * I import it where so that the provider can start immediately
     *
     * @type {import("./index")}
     * *!/
    const AddressesProvider = this.app.use("QueueProvider")

    QueueProvider.initRecursiveJobs()*/
  }
}

module.exports = AddressesProvider
