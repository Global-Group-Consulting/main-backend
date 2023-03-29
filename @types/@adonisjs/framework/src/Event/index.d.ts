export = Event;
/**
 * Event class is used to fire events and bind
 * listeners for them.
 *
 * This class makes use of eventemitter2 module
 *
 * @binding Adonis/Src/Event
 * @alias Event
 * @singleton
 * @group Core
 *
 * @class Event
 * @singleton
 */
declare class Event {
    constructor(Config: any);
    emitter: any;
    _fake: import("./Fake") | null;
    _namespacedListeners: {};
    _many: any;
    /**
     * Resolves a listener via Ioc Container
     *
     * @method _resolveListener
     *
     * @param  {String|Function}         listener
     *
     * @return {Function}
     *
     * @private
     */
    private _resolveListener;
    /**
     * Returns a list of listeners registered
     * for an event
     *
     * @method getListeners
     *
     * @param  {String}  event
     *
     * @return {Array}
     *
     * @example
     * ```js
     * Event.getListeners('http::start')
     * ```
     */
    getListeners(event: string): any[];
    /**
     * Returns a boolean indicating whether an
     * event has listeners or not
     *
     * @method hasListeners
     *
     * @param  {String}     event
     *
     * @return {Boolean}
     *
     * @example
     * ```js
     * Event.hasListeners('http::start')
     * ```
     */
    hasListeners(event: string): boolean;
    /**
     * Returns an array of listeners binded for any
     * event.
     *
     * @method listenersAny
     *
     * @return {Array}
     *
     * @example
     * ```js
     * Event.getListenersAny()
     * ```
     */
    getListenersAny(): any[];
    /**
     * Returns a count of total listeners registered
     * for an event
     *
     * @method listenersCount
     *
     * @param  {String}       event
     *
     * @return {Number}
     *
     * @example
     * ```js
     * Event.listenersCount('http::start')
     * ```
     */
    listenersCount(event: string): number;
    /**
     * Bind a listener for an event
     *
     * @method when
     * @alias on
     *
     * @param  {String} event
     * @param  {Array|String|Function} listeners
     *
     * @return {void}
     *
     * @example
     * ```js
     * // Closure
     * Event.when('http::start', () => {
     * })
     *
     * // IoC container binding
     * Event.when('http::start', 'Http.onStart')
     *
     * // Multiple listeners
     * Event.when('http::start', ['Http.onStart', 'Http.registerViewGlobals'])
     * ```
     */
    when(event: string, listeners: any[] | string | Function): void;
    /**
     * Emits an event
     *
     * @method emit
     * @alias fire
     *
     * @param  {String}    event
     * @param  {...Spread}    args
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.emit('http::start', server)
     * ```
     */
    emit(event: string, ...args: Spread[]): void;
    /**
     * Emit an event
     *
     * @method fire
     * @alias emit
     *
     * @param  {String}    event
     * @param  {...Spread}    args
     *
     * @return {void}
     */
    fire(event: string, ...args: Spread[]): void;
    /**
     * Bind a listener only for x number of times
     *
     * @method times
     *
     * @param  {Number} number
     *
     * @chainable
     *
     * @example
     * ```js
     * Event
     *   .times(3)
     *   .when('user::registers', () => {
     *   })
     * ```
     */
    times(number: number): Event;
    /**
     * Bind a listener for an event
     *
     * @method on
     * @alias when
     *
     * @param  {String} event
     * @param  {Array|String|Function} listeners - A single or multiple listeners
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.on('http::start', function () {
     * })
     * ```
     */
    on(event: string, listeners: any[] | string | Function): void;
    /**
     * Bind listener for any event
     *
     * @method onAny
     * @alias any
     *
     * @param  {String|Function|Array} listeners
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.onAny(function (event, data) {
     * })
     * ```
     */
    onAny(listeners: string | Function | any[]): void;
    /**
     * Bind listener for any event
     *
     * @method any
     * @alias onAny
     *
     * @param  {String|Function|Array} listeners
     *
     * @return {void}
     */
    any(listeners: string | Function | any[]): void;
    /**
     * Bind a listener only for one time
     *
     * @method once
     *
     * @param  {String} event
     * @param  {Array|Function|String} listeners
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.once('user::registerred', function (user) {
     * })
     * ```
     */
    once(event: string, listeners: any[] | Function | string): void;
    /**
     * Remove listener for a given event.
     *
     * @method off
     * @alias removeListener
     *
     * @param  {String} event
     * @param  {Function|Array|String} listeners
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.off('user::registerred', 'User.registered')
     *
     * // remove multiple listeners
     * Event.off('user::registerred', ['User.registered', 'Send.email'])
     * ```
     */
    off(event: string, listeners: Function | any[] | string): void;
    /**
     * Removes listeners binded for any event
     *
     * @method offAny
     *
     * @param  {Function|String|Array} listeners
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.offAny('Http.onStart')
     * ```
     */
    offAny(listeners: Function | string | any[]): void;
    /**
     * Removes listener for a given event
     *
     * @method removeListener
     * @alias off
     *
     * @param  {String}       event
     * @param  {Function|String|Array}       listeners
     *
     * @return {void}
     */
    removeListener(event: string, listeners: Function | string | any[]): void;
    /**
     * Removes all listeners for a given event
     *
     * @method removeAllListeners
     *
     * @param  {String}           event
     *
     * @return {void}
     *
     * @example
     * ```js
     * Event.remvoeAllListeners('http::start')
     * ```
     */
    removeAllListeners(event: string): void;
    /**
     * Update max listeners size which is set to 10
     * by default.
     *
     * @method setMaxListeners
     *
     * @param  {Number}        number
     *
     * @example
     * ```js
     * Event.setMaxListeners(20)
     * ```
     */
    setMaxListeners(number: number): void;
    /**
     * Instantiate faker object, to stop emitting
     * real events
     *
     * @method fake
     *
     * @return {void}
     */
    fake(): void;
    /**
     * Restore faker object
     *
     * @method restore
     *
     * @return {void}
     */
    restore(): void;
}
