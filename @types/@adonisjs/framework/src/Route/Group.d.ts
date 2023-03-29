export = RouteGroup;
/**
 * Route Group class is used to group routes with
 * common behavior. For example prefixing a bunch
 * of routes or applying middleware to a bunch
 * of routes.
 *
 * An instance of group is obtained by calling the
 * `Route.group` method on @ref('RouteManager')
 * class.
 *
 * @class RouteGroup
 * @group Http
 * @constructor
 *
 * @example
 * ```js
 * const group = new RouteGroup([arrayOfRoutes], optionalName)
 * ```
 */
declare class RouteGroup {
    constructor(routes: any, name?: null);
    _routes: any;
    _name: any;
    /**
     * Give a name to a group of routes.
     * This will prefix all routes name.
     *
     * @method as
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .group()
     *   .as('admin')
     * ```
     */
    as(name: any): RouteGroup;
    /**
     * Add middleware to a group of routes.
     * Also see @ref('Route/middleware').
     *
     * @method middleware
     *
     * @param  {Array|String|Spread}   middleware
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .group()
     *   .middleware('auth')
     * ```
     */
    middleware(...middleware: any[] | string | Spread): RouteGroup;
    /**
     * Namespace group of routes.
     * Also see @ref('Route/namespace')
     *
     * @method namespace
     *
     * @param  {String} namespace
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .group()
     *   .namespace('Admin')
     * ```
     */
    namespace(namespace: string): RouteGroup;
    /**
     * Add formats to a group of routes.
     * Also see @ref('Route/formats')
     *
     * @method formats
     *
     * @param  {Array}   formats
     * @param  {Boolean} [strict = false]
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .group()
     *   .formats(['json', 'html'])
     * ```
     */
    formats(formats: any[], strict?: boolean | undefined): RouteGroup;
    /**
     * Prefix group of routes.
     * Also see @ref('Route/prefix')
     *
     * @method prefix
     *
     * @param  {String} prefix
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .group()
     *   .prefix('api/v1')
     * ```
     */
    prefix(prefix: string): RouteGroup;
    /**
     * Add domain to a group of routes.
     * Also see @ref('Route/domain')
     *
     * @method domain
     *
     * @param  {String} domain
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .group()
     *   .domain('blog.adonisjs.com')
     * ```
     */
    domain(domain: string): RouteGroup;
}
declare namespace RouteGroup {
    const _macros: Object;
    const _getters: {};
}
