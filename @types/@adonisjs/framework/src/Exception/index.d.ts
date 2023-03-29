declare const _exports: Exception;
export = _exports;
/**
 * The exception class is used to bind listeners
 * for specific exceptions or add a wildcard to
 * handle all exceptions.
 *
 * This module is used by the HTTP server to pull
 * exception handlers and call them to handle
 * the error.
 *
 * @binding Adonis/Src/Exception
 * @group Http
 * @alias Exception
 * @singleton
 *
 * @class Exception
 * @constructor
 */
declare class Exception {
    /**
     * Clear the handlers and reporters object.
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
    _handlers: {} | undefined;
    _reporters: {} | undefined;
    /**
     * Returns the custom exception handler if defined
     *
     * @method getHandler
     *
     * @param {String} name
     *
     * @returns {Function|Undefined}
     */
    getHandler(name: string): Function | undefined;
    /**
     * Returns the reporter for a given exception. Will fallback
     * to wildcard reporter when defined
     *
     * @method getReporter
     *
     * @param  {String}   name - The exception name
     * @param  {Boolean} [ignoreWildcard = false] Do not return wildcard handler
     *
     * @return {Function|Undefined}
     *
     * @example
     * ```
     * Exception.getReporter('UserNotFoundException')
     * ```
     */
    getReporter(name: string): Function | undefined;
    /**
     * Bind handler for a single exception
     *
     * @method handle
     *
     * @param  {String}   name
     * @param  {Function} callback
     *
     * @chainable
     *
     * ```js
     * Exception.handle('UserNotFoundException', async (error, { request, response }) => {
     *
     * })
     * ```
     */
    handle(name: string, callback: Function): Exception;
    /**
     * Binding reporter for a given exception
     *
     * @method report
     *
     * @param  {String}   name
     * @param  {Function} callback
     *
     * @chainable
     *
     * @example
     * ```js
     * Exception.report('UserNotFoundException', (error, { request }) => {
     *
     * })
     * ```
     */
    report(name: string, callback: Function): Exception;
}
