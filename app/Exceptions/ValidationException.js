'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const { StatusCodes } = require('http-status-codes')

class ValidationException extends LogicalException {
  
  /**
   * Handle this exception by itself
   */
  // handle () {}
  
  constructor (message, status = StatusCodes.BAD_REQUEST) {
    const defaultMessage = 'Dati non validi'
    
    super(message || defaultMessage, status)
  }
}

module.exports = ValidationException
