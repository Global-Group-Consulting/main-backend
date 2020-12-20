'use strict'

const {ServiceProvider} = require('@adonisjs/fold')

class DocSignerProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('DocSigner', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('./index'))(Config)
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
    const test = this.app.use("DocSigner")

    // test.getTemplates()
    // test.createDoc()
    // test.getDocuments()
    // test.sendSignRequest()
  }
}

module.exports = DocSignerProvider
