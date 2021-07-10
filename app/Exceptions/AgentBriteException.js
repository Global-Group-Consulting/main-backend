'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')
const {StatusCodes} = require("http-status-codes")

const defaultMessage = "Agent Brite error"

class AgentBriteException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  constructor(message, status = StatusCodes.BAD_REQUEST) {
    super(message || defaultMessage, status)
  }
}

module.exports = AgentBriteException
