'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

class TokenExpiredException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED)
  }
}

module.exports = TokenExpiredException
