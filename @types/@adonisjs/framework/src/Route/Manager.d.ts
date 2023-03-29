declare const _exports: RouteManager;
export = _exports;
/**
 * Route Manager is the public interface used to define
 * routes, groups and resources.
 *
 * @binding Adonis/Src/Route
 * @alias Route
 * @singleton
 * @group Http
 *
 * @class RouteManager
 */
declare class RouteManager {
    /**
     * Validates the group closure to make sure
     * it is a function
     *
     * @method _validateGroupClosure
     *
     * @param  {Function}            callback
     *
     * @return {void}
     *
     * @private
     */
    private _validateGroupClosure;
    /**
     * Validates that nested groups are not created.
     *
     * @method _validateNestedGroups
     *
     * @return {void}
     *
     * @private
     */
    private _validateNestedGroups;
    /**
     * Reference to @ref('Route') class
     *
     * @attribute Route
     */
    get Route(): typeof Route;
    /**
     * Reference to @ref('RouteGroup') class
     *
     * @attribute RouteGroup
     */
    get RouteGroup(): typeof RouteGroup;
    /**
     * Reference to @ref('RouteResource') class
     *
     * @attribute RouteResource
     */
    get RouteResource(): typeof RouteResource;
    /**
     * Reference to @ref('BriskRoute') class
     *
     * @attribute BriskRoute
     */
    get BriskRoute(): typeof BriskRoute;
    /**
     * Create a new route and push it to the
     * routes store.
     *
     * @method route
     *
     * @param  {String}          route
     * @param  {Function|String} handler
     * @param  {Array}           verbs
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.route('/', 'HomeController.render', ['GET'])
     * ```
     */
    route(route: string, handler: Function | string, verbs: any[]): Route;
    /**
     * Create a new route with `GET` and `HEAD`
     * verbs.
     *
     * @method get
     *
     * @param  {String} route
     * @param  {Function|String} handler
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.get('users', 'UserController.index')
     * ```
     */
    get(route: string, handler: Function | string): Route;
    /**
     * Create a new route with `POST` verb.
     *
     * @method post
     *
     * @param  {String} route
     * @param  {Function|String} handler
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.post('users', 'UserController.store')
     * ```
     */
    post(route: string, handler: Function | string): Route;
    /**
     * Create a new route with `PUT` verb.
     *
     * @method put
     *
     * @param  {String} route
     * @param  {Function|String} handler
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.put('users', 'UserController.update')
     * ```
     */
    put(route: string, handler: Function | string): Route;
    /**
     * Create a new route with `PATCH` verb.
     *
     * @method patch
     *
     * @param  {String} route
     * @param  {Function|String} handler
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.patch('users', 'UserController.update')
     * ```
     */
    patch(route: string, handler: Function | string): Route;
    /**
     * Create a new route with `DELETE` verb.
     *
     * @method delete
     *
     * @param  {String} route
     * @param  {Function|String} handler
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.delete('users', 'UserController.destroy')
     * ```
     */
    delete(route: string, handler: Function | string): Route;
    /**
     * Create a route that response to all the following
     * HTTP verbs. Mostly required when creating a
     * wildcard route for the SPA apps.
     *
     * @method any
     *
     * @param  {String} route
     * @param  {Function|String} handler
     *
     * @return {Route}
     *
     * @example
     * ```js
     * Route.any('*', 'SpaController.render')
     * ```
     */
    any(route: string, handler: Function | string): Route;
    /**
     * Create a route with `GET` and `HEAD`
     * verb, which renders a view by
     * chaining the `render` method.
     *
     * @method on
     *
     * @param  {String} route
     *
     * @return {Object} Object containing the render method
     *
     * @example
     * ```js
     * Route.on('/').render('welcome')
     * ```
     */
    on(route: string): Object;
    /**
     * Resolves and return the route that matches
     * the given **url**, **verb** and the **host**.
     * The Host is only matched when the route has
     * a domain attached to it.
     *
     * ## Note
     * The first matching route will be used. So make
     * sure the generic routes are created after the
     * static routes.
     *
     * @method match
     *
     * @param  {String} url
     * @param  {String} verb
     * @param  {String} [host = null]
     *
     * @return {Object|Null}
     *
     * @example
     * ```js
     * Route.match('users/1', 'GET')
     *
     * // returns { url: 'users/1', params: [1], route: <RouteInstance> }
     * ```
     */
    match(url: string, verb: string, host?: string | undefined): Object | null;
    /**
     * Create a new group to nested routes of
     * same behaviour.
     *
     * @method group
     *
     * @param  {String}   [name = null]
     * @param  {Function} callback
     *
     * @return {RouteGroup}          Instance of {{#crossLink "RouteGroup"}}{{/crossLink}}
     *
     * @example
     * ```js
     * Route.group(function () {
     *   Route.get('users', 'UsersController.index')
     * }).prefix('api/v1')
     * ```
     */
    group(name?: string | undefined, callback: Function): RouteGroup;
    /**
     * Create an instance of resourceful routes, which
     * in turn will create a list of 7 restful routes.
     *
     * @method resource
     *
     * @param  {String} resource
     * @param  {String} controller
     *
     * @return {RouteResource}          Instance of {{#crossLink "RouteResource"}}{{/crossLink}}
     */
    resource(resource: string, controller: string): RouteResource;
    /**
     * Returns an array of all the registered route
     *
     * @method list
     *
     * @return {Array}
     */
    list(): any[];
    /**
     * Make url for a route.
     *
     * @method url
     *
     * @param  {String} urlOrName    - Url, route name or controller action
     * @param  {Object} [data = {}]  - Data object
     * @param  {String} [options]    - Other Options
     *
     * @return {String|Null}
     */
    url(routeNameOrHandler: any, data?: Object | undefined, options?: string | undefined): string | null;
}
import Route = require("./index");
import RouteGroup = require("./Group");
import RouteResource = require("./Resource");
import BriskRoute = require("./Brisk");
