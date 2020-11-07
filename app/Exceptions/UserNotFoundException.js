'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

const defaultMessage = 'User not found!'

class UserNotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message, status = StatusCodes.NOT_FOUND) {
    super(message || defaultMessage, status)
  }
}

module.exports = UserNotFoundException
