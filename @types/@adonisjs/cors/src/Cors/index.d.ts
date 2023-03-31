export = Cors;
/**
 * Cors class to work as a middleware and set CORS headers
 * based upon configurations saved inside `config/cors.js`
 * file.
 *
 * @namespace Adonis/Middleware/Cors
 *
 * @class Cors
 * @constructor
 */
declare class Cors {
    constructor(Config: any);
    options: any;
    /**
     * Finds if an origin is allowed in the list of
     * allowed origins
     *
     * @method _isOriginAllowed
     *
     * @param {String} origin
     * @param {Array} allowedOrigins
     *
     * @private
     */
    private _isOriginAllowed;
    /**
     * Returns the origin to be allowed for CORS
     *
     * @method _getOrigin
     *
     * @param  {String}   origin
     *
     * @return {String}
     *
     * @private
     */
    private _getOrigin;
    /**
     * The list of headers to be allowed for CORS request
     *
     * @method _getHeaders
     *
     * @param  {String}    headers
     *
     * @return {String}
     *
     * @private
     */
    private _getHeaders;
    /**
     * Sets the `Access-Control-Allow-Origin` header
     *
     * @method _setOrigin
     *
     * @param  {String}   origin
     * @param  {Object} response
     *
     * @private
     */
    private _setOrigin;
    /**
     * Sets `Access-Control-Allow-Credentials` header only when
     * `credentials=true` inside the config file.
     *
     * @method _setCredentials
     *
     * @param {Object} response
     *
     * @private
     */
    private _setCredentials;
    /**
     * Set `Access-Control-Expose-Headers` header only when it is
     * defined inside the config file.
     *
     * @method _setExposeHeaders
     *
     * @param  {Object}          response
     *
     * @private
     */
    private _setExposeHeaders;
    /**
     * Set `Access-Control-Allow-Methods` header only when
     * `methods` are defined in the config file.
     *
     * @method _setMethods
     *
     * @param  {Object}    response
     *
     * @private
     */
    private _setMethods;
    /**
     * Set `Access-Control-Allow-Headers` header only when headers
     * are defined inside the config file.
     *
     * @method _setHeaders
     *
     * @param  {String}    headers
     * @param  {Object}    response
     *
     * @private
     */
    private _setHeaders;
    /**
     * Set `Access-Control-Max-Age` header only when `maxAge`
     * is defined inside the config file.
     *
     * @method _setMaxAge
     *
     * @param {Object} response
     *
     * @private
     */
    private _setMaxAge;
    /**
     * Handle the request and respond for OPTIONS request
     *
     * @method handle
     *
     * @param  {Object}   options.request
     * @param  {Object}   options.response
     * @param  {Function} next
     *
     * @return {void}
     */
    handle({ request, response }: Object, next: Function): void;
}
