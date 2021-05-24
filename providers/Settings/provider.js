'use strict'

const {ServiceProvider, ioc} = require('@adonisjs/fold')


class QueueProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('SettingsProvider', () => {
      const Config = this.app.use('Adonis/Src/Config')

      return new (require("."))(Config)
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
    const SettingsProvider = this.app.use("SettingsProvider")
  }
}

module.exports = QueueProvider
