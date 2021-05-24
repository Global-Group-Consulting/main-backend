'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const {StatusCodes} = require("http-status-codes")

const defaultMessage = "Not enough permissions"

class AclGenericException extends LogicalException {
  /**
   * @returns {typeof StatusCodes}
   */
  static get statusCodes() {
    return StatusCodes
  }

  constructor(message = defaultMessage, status = StatusCodes.FORBIDDEN) {
    super(message || defaultMessage, status)
  }
}

module.exports = AclGenericException
