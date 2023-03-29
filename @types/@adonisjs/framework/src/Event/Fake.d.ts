export = EventFake;
/**
 * Event fake is used to bind a fake implementation
 * of event emitter to IoC container
 *
 * @class EventFake
 * @constructor
 */
declare class EventFake {
    _emits: any[];
    _traps: {};
    /**
     * Fake for times
     *
     * @method times
     *
     * @chainable
     */
    times(): EventFake;
    /**
     * Add a callback to get the event data when it's
     * been fired
     *
     * @method trap
     *
     * @param  {String}   event
     * @param  {Function} callback
     *
     * @chainable
     */
    trap(event: string, callback: Function): EventFake;
    /**
     * Stores the event details in memory to run assertions
     *
     * @method emit
     *
     * @param  {String}    event
     * @param  {...Spread} args
     *
     * @return {void}
     */
    emit(event: string, ...data: any[]): void;
    /**
     * @alias this.emit
     */
    fire(...args: any[]): void;
    /**
     * Returns the last event.
     *
     * @method recent
     *
     * @return {Object}
     */
    recent(): Object;
    /**
     * Returns the last sent emitted event and removes
     * it from the store
     *
     * @method pullRecent
     *
     * @return {Object}
     */
    pullRecent(): Object;
    /**
     * Pull x number of recent events from the store
     * and returns them in reverse order
     *
     * @method pullMany
     *
     * @return {Array}
     */
    pullMany(count: any): any[];
    /**
     * Returns a copy of all the events
     *
     * @method all
     *
     * @return {Array}
     */
    all(): any[];
    /**
     * Clear all stored events
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
}
