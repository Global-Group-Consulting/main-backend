'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class EmailSenderProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('EmailSender', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('./EmailSender/index'))(Config)
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
  boot () {
    //
  }
}

module.exports = EmailSenderProvider
