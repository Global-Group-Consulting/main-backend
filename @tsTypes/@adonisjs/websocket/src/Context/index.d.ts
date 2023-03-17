export = WsContext;
/**
 * An instance of this class is passed to all websocket
 * handlers and middleware.
 *
 * @binding Adonis/Src/WsContext
 * @alias WsContext
 * @group Ws
 *
 * @class WsContext
 * @constructor
 *
 * @example
 * ```js
 * const WsContext = use('WsContext')
 *
 * WsContext.getter('view', function () {
 *   return new View()
 * }, true)
 *
 * // The last option `true` means the getter is singleton.
 * ```
 */
declare class WsContext {
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
    static onReady(fn: Function): typeof WsContext;
    constructor(req: any);
    /**
     * Websocket req object
     *
     * @attribute req
     *
     * @type {Object}
     */
    req: Object;
}
declare namespace WsContext {
    const _readyFns: any[] | undefined;
    const _macros: Object;
    const _getters: {};
}
