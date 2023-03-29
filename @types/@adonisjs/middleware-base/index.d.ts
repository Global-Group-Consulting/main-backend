export = MiddlewareBase;
/**
 * MiddlewareBase class is a simple abstraction written to
 * work just with AdonisJs middleware layer.
 *
 * Adonis has global, named and server middleware with a slight
 * difference in each. So this class understands all and offers
 * a simple abstraction around them.
 *
 * @class MiddlewareBase
 *
 * @param {String}   middlewareFn The function to be called on middleware class
 * @param {Function} [warnFn]
 */
declare class MiddlewareBase {
    constructor(middlewareFn: any, warnFn: any);
    _middleware: {
        global: never[];
        server: never[];
        named: {};
        handle: string;
    };
    _warnFn: any;
    /**
     * Throws an exception when middleware is not a function or a raw
     * string.
     *
     * @method _ensureRightMiddlewareType
     *
     * @param  {String|Function}                   middleware
     *
     * @return {void}
     *
     * @throws {RuntimeException} If middleware is not a string or a function
     *
     * @private
     */
    private _ensureRightMiddlewareType;
    /**
     * Takes middleware as a function or string and returns an object, that
     * can be used at runtime to resolve and run middleware
     *
     * @method _middlewareIdentifierToPacket
     *
     * @param  {String|Function}                      item
     *
     * @return {Object}
     *
     * @private
     */
    private _middlewareIdentifierToPacket;
    /**
     * Registers an array of middleware for `server` or `global`
     * type.
     *
     * @method _registerMiddleware
     *
     * @param  {String}            type
     * @param  {Array}             middleware
     * @param  {String}            errorMessage
     *
     * @return {void}
     *
     * @private
     */
    private _registerMiddleware;
    /**
     * Invoked at runtime under the middleware chain. This method will
     * resolve the middleware namespace from the IoC container
     * and invokes it.
     *
     * @method _resolveMiddleware
     *
     * @param  {String|Function} middleware
     * @param  {Array}           options
     *
     * @return {Promise}
     *
     * @private
     */
    private _resolveMiddleware;
    /**
     * Compiles an array of named middleware by getting their namespace from
     * the named hash.
     *
     * @method _compileNamedMiddleware
     *
     * @param  {Array}                namedMiddleware
     *
     * @return {Array}
     *
     * @private
     */
    private _compileNamedMiddleware;
    /**
     * Register global middleware
     *
     * @method registerGlobal
     *
     * @param  {Array}       middleware
     *
     * @return {void}
     *
     * @throws {InvalidArgumentException} If middleware is not an array
     *
     * @example
     * ```js
     * middleware.registerGlobal([
     *   'Adonis/Middleware/BodyParser',
     *   'Adonis/Middleware/Session'
     * ])
     * ```
     */
    registerGlobal(middleware: any[]): void;
    /**
     * Register server type middleware
     *
     * @method use
     *
     * @param  {Array} middleware
     *
     * @return {void}
     *
     * @throws {InvalidArgumentException} If middleware is not an array
     *
     * @example
     * ```js
     * middleware.use(['Adonis/Middleware/Static'])
     * ```
     */
    use(middleware: any[]): void;
    /**
     * Register an object of named middleware
     *
     * @method registerNamed
     *
     * @param  {Object}      middleware
     *
     * @return {void}
     *
     * @throws {InvalidArgumentException} If middleware is not an object with key/value pair.
     *
     * @example
     * ```js
     * middleware.registerNamed({
     *   auth: 'Adonis/Middleware/Auth'
     * })
     * ```
     */
    registerNamed(middleware: Object): void;
    /**
     * Composes server level middleware
     *
     * @method composeServer
     *
     * @return {Runner}
     */
    composeServer(): Runner;
    /**
     * Composes global and named middleware together. Pass empty
     * array when no named middleware are supposed to be
     * executed.
     *
     * @method composeGlobalAndNamed
     *
     * @param  {Array}              namedReference
     *
     * @return {Runner}
     */
    composeGlobalAndNamed(namedReference: any[]): Runner;
}
