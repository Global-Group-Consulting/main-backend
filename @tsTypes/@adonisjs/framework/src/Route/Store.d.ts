declare const _exports: RouteStore;
export = _exports;
/**
 * Route store is used to store registered routes as an
 * array. It is a singleton store to be exported and
 * used by an part of the application to store
 * routes.
 *
 * For example: @ref('RouteResource') makes
 * use of it to store multiple routes.
 *
 * @class RouteStore
 * @group Http
 * @static
 */
declare class RouteStore {
    _routes: any[];
    /**
     * Add a breakpoint to routes. All routes after the
     * breakpoint will be recorded seperately. Helpful
     * for `Route.group`.
     *
     * Also only one breakpoint at a time is allowed.
     *
     * @method breakpoint
     *
     * @param  {String}   name
     *
     * @return {void}
     */
    breakpoint(name?: string): void;
    /**
     * Returns a boolean indicating whether breakpoint
     * is enabled or not.
     *
     * @method hasBreakpoint
     *
     * @return {Boolean}
     */
    hasBreakpoint(): boolean;
    /**
     * Returns the routes recorded during
     * breakpoint.
     *
     * @method breakpointRoutes
     *
     * @return {void}
     */
    breakpointRoutes(): void;
    /**
     * Release the breakpoint.
     *
     * @method releaseBreakpoint
     *
     * @return {void}
     */
    releaseBreakpoint(): void;
    _breakpoint: {
        enabled: boolean;
        routes: never[];
        name: null;
    } | undefined;
    /**
     * Add a route to the store
     *
     * @method add
     *
     * @param  {Route} route
     */
    add(route: Route): void;
    /**
     * Remove route from the store.
     *
     * @method remove
     *
     * @param  {Route} routeToRemove
     *
     * @return {void}
     */
    remove(routeToRemove: Route): void;
    /**
     * Clear all the routes store so far.
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
    /**
     * Find a route with name or it's url
     *
     * @method find
     *
     * @param  {String} nameOrRoute
     * @param  {String} domain
     *
     * @return {Object|Null}
     */
    find(routeNameOrHandler: any, domain: string): Object | null;
    /**
     * Returns a list of stored routes.
     *
     * @method list
     *
     * @return {Array}
     */
    list(): any[];
}
