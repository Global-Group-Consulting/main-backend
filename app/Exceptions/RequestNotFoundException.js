'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

const defaultMessage = 'Request not found!'

class RequestNotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message, status = StatusCodes.NOT_FOUND) {
    super(message || defaultMessage, status)
  }
}

module.exports = RequestNotFoundException
