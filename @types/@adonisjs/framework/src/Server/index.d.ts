export = Server;
/**
 * The HTTP server class to start a new server and bind
 * the entire app around it.
 *
 * This class utilizes the Node.js core HTTP server.
 *
 * @binding Adonis/Src/Server
 * @alias Server
 * @singleton
 * @group Http
 *
 * @class Server
 */
declare class Server {
    constructor(Context: any, Route: any, Logger: any, Exception: any);
    Context: any;
    Route: any;
    Logger: any;
    Exception: any;
    _httpInstance: any;
    _exceptionHandlerNamespace: any;
    _middleware: any;
    /**
     * Returns the exception handler to handle the HTTP exceptions
     *
     * @method _getExceptionHandlerNamespace
     *
     * @return {Class}
     *
     * @private
     */
    private _getExceptionHandlerNamespace;
    /**
     * Returns a middleware iterrable by composing server
     * middleware.
     *
     * @method _executeServerMiddleware
     *
     * @param  {Object}                 ctx
     *
     * @return {Promise}
     *
     * @private
     */
    private _executeServerMiddleware;
    /**
     * Returns a middleware iterrable by composing global and route
     * middleware.
     *
     * @method _executeRouteHandler
     *
     * @param  {Array}                   routeMiddleware
     * @param  {Object}                  ctx
     * @param  {Function}                finalHandler
     *
     * @return {Promise}
     *
     * @private
     */
    private _executeRouteHandler;
    /**
     * Invokes the route handler and uses the return to set the
     * response, only when not set already
     *
     * @method _routeHandler
     *
     * @param  {Object}      ctx
     * @param  {Function}    next
     * @param  {Array}       params
     *
     * @return {Promise}
     *
     * @private
     */
    private _routeHandler;
    /**
     * Pulls the route for the current request. If missing
     * will throw an exception
     *
     * @method _getRoute
     *
     * @param  {Object}  ctx
     *
     * @return {Route}
     *
     * @throws {HttpException} If
     *
     * @private
     */
    private _getRoute;
    /**
     * Sets the response on the response object, only when it
     * has not been set already
     *
     * @method _safelySetResponse
     *
     * @param  {Object}           ctx
     * @param  {Mixed}            content
     * @param  {String}           method
     *
     * @return {void}
     *
     * @private
     */
    private _safelySetResponse;
    /**
     * End the response only when it's pending
     *
     * @method _endResponse
     *
     * @param  {Object}     response
     *
     * @return {void}
     *
     * @private
     */
    private _endResponse;
    /**
     * Returns a boolean indicating if a soft response has been made
     *
     * @method _madeSoftResponse
     *
     * @param  {Object}          response
     *
     * @return {Boolean}
     *
     * @private
     */
    private _madeSoftResponse;
    /**
     * Finds if response has already been made, then ends the response.
     *
     * @method _evaluateResponse
     *
     * @param  {Object}          response
     *
     * @return {void}
     *
     * @private
     */
    private _evaluateResponse;
    /**
     * Handles the exception by invoking `handle` method
     * on the registered exception handler.
     *
     * @method _handleException
     *
     * @param  {Object}         error
     * @param  {Object}         ctx
     *
     * @return {void}
     *
     * @private
     */
    private _handleException;
    /**
     * Register an array of global middleware to be called
     * for each route. If route does not exists, middleware
     * will never will called.
     *
     * Calling this method multiple times will concat to the
     * existing list
     *
     * @method registerGlobal
     *
     * @param  {Array}       middleware
     *
     * @chainable
     *
     * @throws {InvalidArgumentException} If middleware is not an array
     *
     * @example
     * ```js
     * Server.registerGlobal([
     *   'Adonis/Middleware/BodyParser',
     *   'Adonis/Middleware/Session'
     * ])
     * ```
     */
    registerGlobal(middleware: any[]): Server;
    /**
     * Register server middleware to be called no matter
     * whether a route has been registered or not. The
     * great example is a middleware to serve static
     * resources from the `public` directory.
     *
     * @method use
     *
     * @param  {Array} middleware
     *
     * @chainable
     *
     * @throws {InvalidArgumentException} If middleware is not an array
     *
     * @example
     * ```js
     * Server.use(['Adonis/Middleware/Static'])
     * ```
     */
    use(middleware: any[]): Server;
    /**
     * Register named middleware. Calling this method for
     * multiple times will concat to the existing list.
     *
     * @method registerNamed
     *
     * @param  {Object}      middleware
     *
     * @chainable
     *
     * @throws {InvalidArgumentException} If middleware is not an object with key/value pair.
     *
     * @example
     * ```js
     * Server.registerNamed({
     *   auth: 'Adonis/Middleware/Auth'
     * })
     *
     * // use it on route later
     * Route
     *   .get('/profile', 'UserController.profile')
     *   .middleware(['auth'])
     *
     * // Also pass params
     * Route
     *   .get('/profile', 'UserController.profile')
     *   .middleware(['auth:basic'])
     * ```
     */
    registerNamed(middleware: Object): Server;
    /**
     * Returns the http server instance. Also one can set
     * a custom http instance.
     *
     * @method getInstance
     *
     * @return {Object}
     */
    getInstance(): Object;
    /**
     * Set a custom http instance instead of using
     * the default one
     *
     * @method setInstance
     *
     * @param  {Object}    httpInstance
     *
     * @return {void}
     *
     * @example
     * ```js
     * const https = require('https')
     * Server.setInstance(https)
     * ```
     */
    setInstance(httpInstance: Object): void;
    /**
     * Handle method executed for each HTTP request and handles
     * the request lifecycle by performing following operations.
     *
     * 1. Call server level middleware
     * 2. Resolve route
     * 3. Call global middleware
     * 4. Call route middleware
     * 5. Execute route handler.
     *
     * Also if route is not found. All steps after that are not
     * executed and 404 exception is thrown.
     *
     * @method handle
     * @async
     *
     * @param  {Object} req
     * @param  {Object} res
     *
     * @return {void}
     */
    handle(req: Object, res: Object): void;
    /**
     * Binds the exception handler to be used for handling HTTP
     * exceptions. If `namespace` is not provided, the server
     * will choose the conventional namespace
     *
     * @method bindExceptionHandler
     *
     * @param  {String}             [namespace]
     *
     * @chainable
     */
    bindExceptionHandler(namespace?: string | undefined): Server;
    /**
     * Listen on given host and port.
     *
     * @method listen
     *
     * @param  {String}   [host = localhost]
     * @param  {Number}   [port = 3333]
     * @param  {Function} [callback]
     *
     * @return {Object}
     */
    listen(host?: string | undefined, port?: number | undefined, callback?: Function | undefined): Object;
    /**
     * Closes the HTTP server
     *
     * @method close
     *
     * @param  {Function} callback
     *
     * @return {void}
     */
    close(callback: Function): void;
}
