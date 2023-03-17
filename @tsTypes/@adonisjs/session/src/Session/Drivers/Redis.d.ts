export = Redis;
/**
 * Redis driver to save session values to the
 * redis store.
 *
 * @class Redis
 * @constructor
 */
declare class Redis {
    /**
     * Namespaces to inject
     *
     * @attribute inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Config: any, Redis: any);
    /**
     * Setting up ttl in seconds
     */
    ttl: number;
    /**
     * Setting cluster to false for sessions
     */
    redis: any;
    /**
     * Read values from cookies
     *
     * @param  {String} sessionId
     *
     * @method read
     * @async
     *
     * @return {Object}
     */
    read(sessionId: string): Object;
    /**
     * Write cookie values
     *
     * @method write
     * @async
     *
     * @param  {String} sessionId
     * @param  {Object} values
     *
     * @return {void}
     */
    write(sessionId: string, values: Object): void;
    /**
     * Touching the cookies by resetting it. There is no way
     * to just update the expires time on the cookie
     *
     * @method touch
     * @async
     *
     * @param  {String} sessionId
     * @param  {Object} values
     *
     * @return {void}
     */
    touch(sessionId: string): void;
}
declare namespace Redis {
    const redis: any;
}
