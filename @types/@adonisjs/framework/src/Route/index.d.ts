export = Route;
/**
 * This class defines a single route. It supports dynamic
 * **url segments**, **formats**, **middleware**
 * and **named routes**.
 *
 * Generally you will get the instance of the by calling
 * one of the route method on the @ref('RouteManager')
 * class.
 *
 * Example: `Route.get`, `Route.post`.
 *
 * @class Route
 * @group Http
 * @constructor
 *
 * @example
 * ```
 * const route = new Route('users', 'HomeController.index', ['GET'])
 * ```
 */
declare class Route {
    constructor(route: any, handler: any, verbs?: string[]);
    /**
     * Validates the route to make sure it is a
     * valid string
     *
     * @method _validateRoute
     *
     * @param  {String}       route
     *
     * @return {void}
     *
     * @private
     */
    private _validateRoute;
    /**
     * Validates the handler to make sure it is a function
     * or a string, which is considered to be a reference
     * to the IoC container.
     *
     * @method _validateHandler
     *
     * @param  {Function|String}         handler
     *
     * @return {void}
     *
     * @private
     */
    private _validateHandler;
    /**
     * Validate HTTP verbs to make sure it is an
     * array
     *
     * @method _validateVerbs
     *
     * @param  {Array}       verbs
     *
     * @return {void}
     *
     * @private
     */
    private _validateVerbs;
    /**
     * Instantiate private properties on the route instance
     *
     * @method _instantiate
     *
     * @param  {String}              route
     * @param  {Array}               verbs
     * @param  {Function|String}     handler
     *
     * @return {void}
     *
     * @private
     */
    private _instantiate;
    /**
     * Private properties
     */
    _route: any;
    _keys: any[] | undefined;
    /**
     * Public properties
     */
    verbs: any[] | undefined;
    handler: any;
    name: string | undefined;
    forDomain: any;
    middlewareList: any;
    domainKeys: any[] | undefined;
    /**
     * Make the regexp pattern for the route. Later this
     * expression is used to match urls.
     *
     * @method _makeRoutePattern
     *
     * @return {void}
     *
     * @private
     */
    private _makeRoutePattern;
    _regexp: any;
    /**
     * Returns an object of dynamic domains for a given
     * route.
     *
     * @method _getSubDomains
     *
     * @param  {String}       host
     *
     * @return {Object|Null}
     *
     * @private
     */
    private _getSubDomains;
    /**
     * Define domain for the route. If domain is defined
     * then route will only resolve when domain matches.
     *
     * @method domain
     *
     * @param  {String}  domain
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .get(...)
     *   .domain('blog.adonisjs.com')
     * ```
     */
    domain(domain: string): Route;
    /**
     * Define formats on a given route. Formats can be
     * used to do explicit content negotiation based
     * upon the url extension.
     *
     * @method formats
     *
     * @param  {Array}  formats
     * @param  {Boolean} [strict = false] - Strict flag will only allow route with format extension.
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .get(...)
     *   .formats(['json', 'html'])
     * ```
     */
    formats(formats: any[], strict?: boolean | undefined): Route;
    /**
     * Give name to the route, easier to remember
     * and resolve later.
     *
     * @method as
     *
     * @param  {String} name
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .get(...)
     *   .as('name')
     * ```
     */
    as(name: string): Route;
    /**
     * Add middleware to the middleware queue to be executed
     * before the route handler is executed.
     *
     * Calling this method for the multiple times will `concat`
     * to the list of middleware.
     *
     * @method middleware
     *
     * @param  {...Spread} middleware
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .get('...')
     *   .middleware('auth')
     *
     * // Or
     * Route
     *   .get('...')
     *   .middleware(['auth', 'acl'])
     *
     * // Also pure functions
     * Route
     *   .get('...')
     *   .middleware(async function () {
     *
     *   })
     * ```
     */
    middleware(...middleware: Spread[]): Route;
    /**
     * Add a folder namespace to the route. Generally
     * used by the Route group to namespace a bunch of
     * routes that are all inside the same folder.
     *
     * @method namespace
     *
     * @param  {String} namespace
     *
     * @chainable
     *
     * @example
     * ```
     * Route
     *   .get(...)
     *   .namespace('Admin')
     * ```
     */
    namespace(namespace: string): Route;
    /**
     * Add middleware to the front of the route. The method is
     * same as `middleware` instead just prepends instead of
     * append.
     *
     * @method prependMiddleware
     *
     * @param  {...Spread}       middleware
     *
     * @chainable
     */
    prependMiddleware(...middleware: Spread[]): Route;
    /**
     * Prefix the route with some string. Generally
     * used by the Route group to prefix a bunch
     * of routes.
     *
     * @method prefix
     *
     * @param  {String} prefix
     *
     * @chainable
     *
     * @example
     * ```
     * Route
     *   .get(...)
     *   .prefix('api/v1')
     * ```
     */
    prefix(prefix: string): Route;
    /**
     * Resolves the url by matching it against
     * the registered route and verbs. It will
     * return `null` when url does not belongs
     * to this route.
     *
     * @method resolve
     *
     * @param  {String} url
     * @param  {String} verb
     * @param  {String} [host] - Required only when route has subdomain
     *
     * @return {Object|Null}
     *
     * @example
     * ```js
     * // Register route
     * const route = new Route('make/:drink', 'DrinkController.make', ['GET'])
     *
     * // Resolve url
     * route.resolve('make/coffee', 'GET')
     *
     * // Returns
     * { url: 'make/coffee', params: ['coffee'] }
     * ```
     */
    resolve(url: string, verb: string, host?: string | undefined): Object | null;
    /**
     * Returns the JSON representation of the route.
     *
     * @method toJSON
     *
     * @return {Object}
     */
    toJSON(): Object;
}
declare namespace Route {
    const _macros: Object;
    const _getters: {};
}
