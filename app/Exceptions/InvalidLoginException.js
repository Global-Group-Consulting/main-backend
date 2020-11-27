'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

const defaultMessage = 'Invalid username or password!'

class InvalidLoginException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message, status = StatusCodes.NOT_ACCEPTABLE) {
    super(message || defaultMessage, status)
  }
}

module.exports = InvalidLoginException
