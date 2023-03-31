export = Context;
/**
 * An instance of this class is passed to all route handlers
 * and middleware. Also different part of applications
 * can bind getters to this class.
 *
 * @binding Adonis/Src/HttpContext
 * @alias HttpContext
 * @group Http
 *
 * @class Context
 * @constructor
 *
 * @example
 * ```js
 * const Context = use('Context')
 *
 * Context.getter('view', function () {
 *   return new View()
 * }, true)
 *
 * // The last option `true` means the getter is singleton.
 * ```
 */
declare class Context {
    /**
     * Hydrate the context constructor
     *
     * @method hydrate
     *
     * @return {void}
     */
    static hydrate(): void;
    /**
     * Define onReady callbacks to be executed
     * once the request context is instantiated
     *
     * @method onReady
     *
     * @param  {Function} fn
     *
     * @chainable
     */
    static onReady(fn: Function): typeof Context;
    constructor(req: any, res: any);
    /**
     * Node.js http server req object
     *
     * @attribute req
     *
     * @type {Object}
     */
    req: Object;
    /**
     * Node.js http server res object
     *
     * @attribute res
     *
     * @type {Object}
     */
    res: Object;
}
declare namespace Context {
    const _readyFns: any[] | undefined;
    const _macros: Object;
    const _getters: {};
}
