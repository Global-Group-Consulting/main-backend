'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const {StatusCodes} = require("http-status-codes")

const defaultMessage = "Can't execute the required action"

class AclGenericException extends LogicalException {
  /**
   * @returns {typeof StatusCodes}
   */
  static get statusCodes() {
    return StatusCodes
  }

  constructor(message = defaultMessage, status = StatusCodes.BAD_REQUEST) {
    super(message, status)
  }
}

module.exports = AclGenericException
