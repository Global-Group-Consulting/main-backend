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

    if (er.response) {
      if (er.response.data) {
        message = er.response.data.message;
        statusCode = er.response.data.statusCode
      } else {
        message = er.response.statusText;
        statusCode = er.response.status
      }
    }

    super(message, statusCode)
  }
}

module.exports = ProxyException
