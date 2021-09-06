'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const {StatusCodes} = require("http-status-codes")

const defaultMessage = "Generic error."

class ProxyException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  constructor(er) {
    let message = er.message;
    let statusCode = StatusCodes.BAD_REQUEST;
    let code = null

    if (er.response) {
      if (er.response.data) {
        message = er.response.data.message;
        statusCode = er.response.data.statusCode
        code = er.response.data.error
      } else {
        message = er.response.statusText;
        statusCode = er.response.status
      }
    }

    if (er.code === "ECONNREFUSED") {
      return super("Can't connect to server", StatusCodes.SERVICE_UNAVAILABLE, er.code)
    }

    super(message, statusCode, code)
  }
}

module.exports = ProxyException
