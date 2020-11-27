'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const MovementTypes = require("../enums/MovementTypes")

class CustomValidatorProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
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
    const Validator = use('Validator')

    Validator.extend('idExists', async function (data, field, message, args, get) {
      const User = use('App/Models/User')
      const value = get(data, field)

      if (!value) {
        return
      }

      const existingUser = await User.find(value)

      if (!existingUser) {
        throw "Invalid id."
      }
    })

    Validator.extend('validAccountStatus', async function (data, field, message, args, get) {
      const AccountStatuses = require('../enums/AccountStatuses')
      const value = get(data, field)

      if (!value) {
        return
      }

      const statusExists = AccountStatuses.iterable.find(_status => {
        return _status.value === value
      })

      if (!statusExists) {
        throw "Invalid status"
      }
    })

    Validator.extend('objectId', async function (data, field, message, args, get) {
      const { ObjectId } = require('mongodb')
      const value = get(data, field)
      let validObjectId = true

      if (!value) {
        return
      }

      try {
        validObjectId = new ObjectId(value).toString() === value
      } catch (er) {
        validObjectId = false
      }

      if (!validObjectId) {
        throw "Invalid id"
      }
    })

    Validator.extend('validMovement', async function (data, field, message, args, get) {
      const value = get(data, field)
      let validObjectId = true

      if (Number.isNaN(+value)) {
        return
      }

      const existingType = MovementTypes.data[value]

      if (!existingType) {
        throw "Invalid movement type"
      }

    })
  }
}

module.exports = CustomValidatorProvider
