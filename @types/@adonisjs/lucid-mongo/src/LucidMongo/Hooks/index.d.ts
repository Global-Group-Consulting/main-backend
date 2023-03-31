export = Hooks;
/**
 * This class is used internally by @ref('Model') to add
 * hooks functionality.
 *
 * Hooks are executed in sequence for a given event.
 *
 * @class Hooks
 * @constructor
 */
declare class Hooks {
    _events: string[];
    /**
     * The event aliases. Whenever a handler is saved for a alias,
     * it will called when those events occurs.
     *
     * @type {Object}
     */
    _aliases: Object;
    /**
     * The events array of aliases, just required
     * for validation purposes
     *
     * @type {Array}
     */
    _aliasEvents: any[];
    /**
     * A map of handlers to be called for each event
     *
     * @type {Object}
     */
    _handlers: Object;
    /**
     * Adds a new handler for an event. Make sure to give
     * handler a unique name if planning to remove it
     * later at runtime
     *
     * @method addHandler
     *
     * @param  {String}   event
     * @param  {Function|String}   handler
     * @param  {String}   [name]
     *
     * @return {void}
     *
     * @example
     * ```
     * this.addHandler('create', async function () {
     * })
     * ```
     */
    addHandler(event: string, handler: Function | string, name?: string | undefined): void;
    /**
     * Removes handler using it's name. This methods returns
     * void when successfully executed, otherwise an
     * exception is thrown.
     *
     * @method removeHandler
     *
     * @param  {String}      event
     * @param  {String}      name
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.removeHandler('create', 'updatePassword')
     * ```
     *
     * @throws {InvalidArgumentException} If `name` is missing
     */
    removeHandler(event: string, name: string): void;
    /**
     * Removes all handlers for a given event. This method
     * returns void when successfully executed, otherwise
     * an exception is thrown.
     *
     * @method removeAllHandlers
     *
     * @param  {String}          event
     *
     * @return {void}
     *
     * @example
     * ```
     * this.removeAllHandlers('create')
     * ```
     */
    removeAllHandlers(event: string): void;
    /**
     * Execute hooks in sequence. If this method doesn't
     * throws an exception, means everything went fine.
     *
     * @method exec
     * @async
     *
     * @param  {String} event
     * @param  {Spread} ...args
     *
     * @return {void}
     */
    exec(event: string, ...args: any[]): void;
}
