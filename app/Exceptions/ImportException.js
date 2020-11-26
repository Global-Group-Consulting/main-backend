'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require("http-status-codes")

const defaultMessage = 'Can\'t import the provided file'

class ImportException extends LogicalException {
  static get statuses() {
    return StatusCodes
  }

  /**
   * 
   * @param {string} message 
   * @param {StatusCodes} status 
   */
  constructor(message, status = StatusCodes.EXPECTATION_FAILED) {
    super(message || defaultMessage, status)
  }
}

module.exports = ImportException
