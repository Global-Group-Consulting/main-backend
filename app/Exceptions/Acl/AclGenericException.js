'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const {StatusCodes} = require("http-status-codes")

const defaultMessage = "Can't execute the required action"

class AclGenericException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor(message = defaultMessage, status = StatusCodes.BAD_REQUEST) {
    super(message, status)
  }
}

module.exports = AclGenericException
