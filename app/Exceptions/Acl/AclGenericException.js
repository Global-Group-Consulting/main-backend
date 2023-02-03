'use strict'

const {StatusCodes} = require("http-status-codes")
const { LocalizedException } = require('../LocalizedException')

const defaultMessage = "Not enough permissions"

class AclGenericException extends LocalizedException {
  /**
   * @returns {typeof StatusCodes}
   */
  static get statusCodes() {
    return StatusCodes
  }

  constructor(message = defaultMessage, status = StatusCodes.FORBIDDEN) {
    super(message, status)
  }
}

module.exports = AclGenericException
