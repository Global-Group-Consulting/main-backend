'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');
const { StatusCodes } = require('http-status-codes');

class CronException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}

  constructor (message, status = StatusCodes.BAD_REQUEST) {
    super(message, status);
  }
}

module.exports = CronException;
