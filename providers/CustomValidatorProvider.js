'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CustomValidatorProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
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
    const Validator = use('Validator')

    Validator.extend('idExists', async function (data, field, message, args, get) {
      const User = use('App/Models/User')
      const value = get(data, field)

      if (!value) {
        return
      }

      const existingUser = await User.find(value)

      if (!existingUser){
        throw "Invalid id."
      }
    })
  }
}

module.exports = CustomValidatorProvider
