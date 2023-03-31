export = BaseExceptionHandler;
declare class BaseExceptionHandler {
    /**
     * Returns error formatted by youch
     *
     * @method _getYouchError
     * @async
     *
     * @param  {Object}       error  - The error object
     * @param  {Object}       req    - Current request object
     * @param  {Boolean}      isJSON - Does response has to be in JSON
     *
     * @return {Html|Object}
     *
     * @private
     */
    private _getYouchError;
    /**
     * Returns plain error to be used when running
     * server in production. Since production
     * server should not show error stack.
     *
     * @method _getPlainError
     *
     * @param  {Object}       error  - The error object
     * @param  {Boolean}      isJSON - Does response has to be in JSON
     *
     * @return {Object}
     *
     * @private
     */
    private _getPlainError;
    /**
     * The default handler to report exception when no one handles
     * a given exception
     *
     * @method _defaultHandler
     *
     * @param  {Object}        error
     * @param  {Object}        options.request
     * @param  {Object}        options.response
     *
     * @return {void}
     *
     * @private
     */
    private _defaultHandler;
    /**
     * Handles the exception by sending a response
     *
     * @method handle
     *
     * @param  {Object} error
     * @param  {Object} ctx
     *
     * @return {Mixed}
     */
    handle(error: Object, ctx: Object): Mixed;
    /**
     * Reports the error by invoking report on the exception
     * or pulls a custom defined reporter
     *
     * @method report
     *
     * @param  {Object} error
     * @param  {Object} ctx
     *
     * @return {void}
     */
    report(error: Object, ctx: Object): void;
}
