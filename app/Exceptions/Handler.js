'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const Log = use("App/Models/Log")

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    //response.status(error.status).json(error)
    return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    const errorsToIgnore = ["InvalidLoginException", "TokenExpiredException"];

    if (errorsToIgnore.includes(error.name)) {
      return;
    }

    await Log.create({
      ...error,
      code: error.code,
      message: error.message,
      name: error.name,
      status: error.status,
      stack: error.stack,
      request: {
        headers: request.headers(),
        all: request.all(),
        ip: request.ip(),
        ips: request.ips(),
        method: request.method(),
        originalUrl: request.originalUrl()
      }
    })
  }
}

module.exports = ExceptionHandler
