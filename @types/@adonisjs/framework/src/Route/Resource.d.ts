export = RouteResource;
/**
 * Route Resource class is used to define resourceful
 * routes. You can create a resource instance by
 * calling `Route.resource()` method.
 *
 * @class RouteResource
 * @group Http
 * @constructor
 */
declare class RouteResource {
    constructor(resource: any, controller: any, groupPrefix?: null);
    _resourceUrl: string;
    _controller: any;
    /**
     * The name prefix is used to prefix the route names.
     * Generally used when resource is defined inside
     * the Route group
     *
     * @type {String}
     */
    prefix: string;
    _routes: any[];
    /**
     * Validates the resource name to make sure it
     * is a valid string.
     *
     * @method _validateResourceName
     *
     * @param  {String}              resource
     *
     * @return {void}
     *
     * @private
     */
    private _validateResourceName;
    /**
     * Validates the resource controller to a valid
     * string. Existence of controller is validated
     * when the controller is resolved.
     *
     * @method _validateController
     *
     * @param  {String}            controller
     *
     * @return {void}
     *
     * @private
     */
    private _validateController;
    /**
     * Makes the correct resource url by properly
     * configuring nested resources.
     *
     * @method _makeResourceUrl
     *
     * @param  {String}      resource
     *
     * @return {String}
     *
     * @private
     *
     * @example
     * ```js
     * _makeResourceUrl('user.posts')
     * // returns - user/:user_id/posts
     * ```
     */
    private _makeResourceUrl;
    /**
     * Add route to the routes array and to the
     * routes store.
     *
     * @method _addRoute
     *
     * @param  {String}  action
     * @param  {String}  route
     * @param  {Array}   verbs
     *
     * @private
     */
    private _addRoute;
    /**
     * Add basic routes to the routes list. The list
     * is further filtered using `only` and `except`
     * methods.
     *
     * @method _addBasicRoutes
     *
     * @private
     */
    private _addBasicRoutes;
    /**
     * Matches the route against an array of names. It will
     * match the route action and it's original name
     *
     * @method _matchName
     *
     * @param  {Route}   route
     * @param  {Array}   names
     *
     * @return {Boolean}
     *
     * @private
     */
    private _matchName;
    /**
     * Remove all routes from the resourceful list except the
     * one defined here.
     *
     * @method only
     *
     * @param  {Array} names
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .resource()
     *   .only(['store', 'update'])
     * ```
     */
    only(names: any[]): RouteResource;
    /**
     * Remove the routes define here from the resourceful list.
     *
     * @method except
     *
     * @param  {Array} names
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .resource()
     *   .except(['delete'])
     * ```
     */
    except(names: any[]): RouteResource;
    /**
     * Limit the number of routes to api only. In short
     * this method will remove `create` and `edit`
     * routes.
     *
     * @method apiOnly
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .resource()
     *   .apiOnly()
     * ```
     */
    apiOnly(): RouteResource;
    /**
     * Save middleware to be applied on the resourceful routes. This
     * method also let you define conditional middleware based upon
     * the route attributes.
     *
     * For example you want to apply `auth` middleware to the `store`,
     * `update` and `delete` routes and want other routes to be
     * publicly accessible. Same can be done by passing a
     * closure to this method and returning an array
     * of middleware to be applied.
     *
     * ## NOTE
     * The middleware closure will be executed for each route.
     *
     * @method middleware
     *
     * @param  {Array|Map} middleware
     *
     * @chainable
     *
     * @example
     * ```js
     * Route
     *   .resource()
     *   .middleware(['auth'])
     *
     * // or use ES6 maps
     * Route
     *   .resource('user', 'UserController')
     *   .middleware(new Map([
     *     [['user.store', 'user.update', 'user.delete'], 'auth']
     *   ]))
     * ```
     */
    middleware(middleware: any[] | Map<any, any>): RouteResource;
    /**
     * Define route formats for all the routes inside
     * a resource.
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
     *   .resource()
     *   .formats(['json'], true)
     * ```
     */
    formats(formats: any[], strict?: boolean | undefined): void;
}
declare namespace RouteResource {
    const _macros: Object;
    const _getters: {};
}
