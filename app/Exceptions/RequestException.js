'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const {StatusCodes} = require("http-status-codes")

const defaultMessage = 'Request error'

class RequestException extends LogicalException {
  /**
   * @returns {typeof StatusCodes}
   */
  static get statusCodes() {
    return StatusCodes
  }

  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message, status = StatusCodes.BAD_REQUEST) {
    super(message || defaultMessage, status)
  }
}

module.exports = RequestException
