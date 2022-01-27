'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');
const { StatusCodes } = require("http-status-codes");
const Logger = use("Logger");

const defaultMessage = "Generic error.";

class ProxyException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  constructor (er) {
    let message = er.message;
    let statusCode = StatusCodes.BAD_REQUEST;
    let code = null;

    if (er.response) {
      Logger.error("[ProxyException] " + JSON.stringify(er.response.data));

      if (er.response.data) {
        message = er.response.data.message || er.response.statusText;
        statusCode = er.response.data.statusCode || er.response.status;
        code = er.response.data.error || er.response.data.name;

        if (statusCode === 500) {
          if (er.response.data.logId) {
            message = "There was an internal server error. Please contact the site owner and provide this code: " + er.response.data.logId;
          } else {
            message = "There was an internal server error. Please contact the site owner!";
          }
        }
      } else {
        message = er.response.statusText;
        statusCode = er.response.status;
      }
    }

    if (er.code === "ECONNREFUSED") {
      return super("Can't connect to server", StatusCodes.SERVICE_UNAVAILABLE, er.code)
    }

    super(message, statusCode, code)
  }
}

module.exports = ProxyException
