'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

const defaultMessage = 'Can\'t create the required communication.'

class CommunicationException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  /**
   * 
   * @param {string} message 
   * @param {StatusCodes} status 
   */
  constructor(message, status = StatusCodes.BAD_REQUEST) {
    super(message || defaultMessage, status)
  }
}

module.exports = CommunicationException
