'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

const defaultMessage = "Invalid movement."

class InvalidMovementException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message, status = StatusCodes.BAD_REQUEST) {
    super(message || defaultMessage, status)
  }
}

module.exports = InvalidMovementException
