export = Cookie;
/**
 * Cookie driver to save session values to the
 * cookie.
 *
 * @class Cookie
 * @constructor
 */
declare class Cookie {
    /**
     * Namespaces to inject
     *
     * @attribute inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Config: any);
    _request: Object | null;
    _response: Object | null;
    _options: Object;
    _key: string;
    /**
     * Set request and response objects for the current
     * request
     *
     * @method setRequest
     *
     * @param  {Object}   request
     * @param  {Object}   response
     */
    setRequest(request: Object, response: Object): void;
    /**
     * Read values from cookies
     *
     * @param  {String} sessionId
     *
     * @method read
     *
     * @return {Object}
     */
    read(): Object;
    /**
     * Write cookie values
     *
     * @method write
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
     *
     * @param  {String} sessionId
     * @param  {Object} values
     *
     * @return {void}
     */
    touch(sessionId: string, values: Object): void;
}
