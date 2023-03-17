export = Response;
/**
 * A facade over Node.js HTTP `res` object, making it
 * easier and simpler to make HTTP response. You can
 * access the original **response** object as
 * `response.response`
 *
 * @binding Adonis/Src/Response
 * @group Http
 *
 * @class Response
 */
declare class Response {
    constructor(adonisRequest: any, Config: any);
    /**
     * Reference to adonisjs request
     *
     * @type {Request}
     */
    adonisRequest: Request;
    /**
     * Reference to native HTTP request object
     *
     * @attribute request
     * @type {Object}
     */
    request: Object;
    /**
     * Reference to native HTTP response object
     *
     * @attribute response
     * @type {Object}
     */
    response: Object;
    /**
     * Here we store the body of the response and wait
     * for the entire HTTP life-cycle to finish unless
     * we end the response. This gives a chance to
     * modify the response via middlewares executed
     * after the route handler or controller method.
     *
     * @attribute _lazyBody
     *
     * @type {Object}
     * @private
     */
    private _lazyBody;
    /**
     * Implicitly end the response. If you set it
     * to false, calling `response.end` will
     * end the response.
     *
     * @type {Boolean}
     */
    implicitEnd: boolean;
    Config: any;
    /**
     * lazyBody to be set as the response body.
     *
     * @method lazyBody
     *
     * @return {Object}
     */
    get lazyBody(): Object;
    /**
     * returns whether request has been
     * finished or not
     *
     * @attribute finished
     *
     * @return {Boolean}
     */
    get finished(): boolean;
    /**
     * returns whether request headers
     * have been sent or not
     *
     * @attribute headersSent
     *
     * @return {Boolean}
     */
    get headersSent(): boolean;
    /**
     * returns whether a request is pending
     * or not
     *
     * @attribute isPending
     *
     * @return {Boolean}
     */
    get isPending(): boolean;
    /**
     * Returns a boolean indicating whether etag should be generated
     * for a request or not.
     *
     * @method _generateEtag
     *
     * @param  {Boolean}      setToTrue
     * @param  {Boolean}     hasBody
     *
     * @return {Boolean}
     *
     * @private
     */
    private _generateEtag;
    /**
     * Writes response to the res object
     *
     * @method _writeResponse
     *
     * @param  {String}       method
     * @param  {Mixed}       content
     * @param  {Array}       args
     *
     * @return {void}
     *
     * @private
     */
    private _writeResponse;
    /**
     * Sets the response body. If implicitEnd is set to `false`,
     * then it will end the response right away, otherwise
     * will store it to be sent later.
     *
     * @method _invoke
     *
     * @param  {String} method
     * @param  {Mixed} content
     * @param  {Array} args
     *
     * @return {void}
     *
     * @private
     */
    private _invoke;
    /**
     * Set the response status code.
     *
     * @method status
     *
     * @param  {Number} statusCode
     *
     * @chainable
     */
    status(statusCode: number): Response;
    /**
     * Set HTTP response header. Resetting same header
     * multiple times will append to the existing
     * value.
     *
     * @method header
     *
     * @param  {String} key
     * @param  {String} value
     *
     * @chainable
     */
    header(key: string, value: string): Response;
    /**
     * Set HTTP response header only if it does not
     * exists already
     *
     * @method safeHeader
     *
     * @param  {String}   key
     * @param  {String}   value
     *
     * @chainable
     */
    safeHeader(key: string, value: string): Response;
    /**
     * Remove the existing HTTP response header.
     *
     * @method removeHeader
     *
     * @param  {String}     key
     *
     * @chainable
     */
    removeHeader(key: string): Response;
    /**
     * Returns the value of header for a given key.
     *
     * @method getHeader
     *
     * @param  {String}  key
     *
     * @return {Mixed}
     */
    getHeader(key: string): Mixed;
    /**
     * Stream a file to the client as HTTP response.
     *
     * Options are passed directly to [send](https://www.npmjs.com/package/send)
     *
     * @method download
     *
     * @param  {String} filePath
     * @param  {Object} options
     *
     * @return {void}
     */
    download(filePath: string, options?: Object): void;
    /**
     * Force download the file by setting `Content-disposition`
     * header.
     *
     * @method attachment
     *
     * @param  {String}   filePath
     * @param  {String}   [name]
     * @param  {String}   [disposition]
     * @param  {Object}   [options = {}]
     *
     * @return {void}
     */
    attachment(filePath: string, name?: string | undefined, disposition?: string | undefined, options?: Object | undefined): void;
    /**
     * Set the `Location` header on HTTP response.
     *
     * @method location
     *
     * @param  {String} url
     *
     * @chainable
     */
    location(url: string): Response;
    /**
     * Redirect the request by setting the `Location`
     * header and ending the response
     *
     * @method redirect
     *
     * @param  {String} url
     * @param  {Boolean} [sendParams = false]
     * @param  {Number} [status = 302]
     *
     * @return {void}
     */
    redirect(url: string, sendParams?: boolean | undefined, status?: number | undefined): void;
    /**
     * Redirect to a specific route
     *
     * @method route
     *
     * @param  {String} routeNameOrHandler
     * @param  {Object} [data = {}]
     * @param  {String} [domain]
     * @param  {Boolean} [sendParams = false]
     * @param  {Number} [status = 302]
     *
     * @return {void}
     */
    route(routeNameOrHandler: string, data?: Object | undefined, domain?: string | undefined, sendParams?: boolean | undefined, status?: number | undefined): void;
    /**
     * Add the HTTP `Vary` header
     *
     * @method vary
     *
     * @param  {String} field
     *
     * @chainable
     */
    vary(field: string): Response;
    /**
     * Sets the `Content-type` header based on the
     * type passed to this method.
     *
     * @method type
     *
     * @param  {String} type
     * @param  {String} [charset]
     *
     * @chainable
     */
    type(type: string, charset?: string | undefined): Response;
    /**
     * Sets the response body for the HTTP request.
     *
     * @method send
     *
     * @param  {*} body
     * @param  {Boolean} generateEtag
     *
     * @return {void}
     */
    send(body: any, generateEtag?: boolean): void;
    /**
     * Sets the response body for the HTTP request with
     * explicit `content-type` set to `application/json`.
     *
     * @method json
     *
     * @param  {Object} body
     * @param  {Boolean} generateEtag
     *
     * @return {void}
     */
    json(body: Object, generateEtag?: boolean): void;
    /**
     * Sets the response body for the HTTP request with
     * explicit `content-type` set to `text/javascript`.
     *
     * @method jsonp
     *
     * @param  {Object} body
     * @param  {String} [callbackFn = 'callback'] - Callback name.
     * @param  {Boolean} generateEtag
     *
     * @return {void}
     */
    jsonp(body: Object, callbackFn?: string | undefined, generateEtag?: boolean): void;
    /**
     * Ends the response by setting the `_lazyBody` as the
     * response body.
     *
     * @method end
     *
     * @return {void}
     */
    end(): void;
    /**
     * Send cookie with the http response
     *
     * @method cookie
     *
     * @param  {String} key
     * @param  {Mixed} value
     * @param  {Object} [options = {}]
     *
     * @return {void}
     */
    cookie(key: string, value: Mixed, options?: Object | undefined): void;
    /**
     * Set plain cookie HTTP response
     *
     * @method plainCookie
     *
     * @param  {String}    key
     * @param  {Mixed}    value
     * @param  {Object}    [options = {}]
     *
     * @return {void}
     */
    plainCookie(key: string, value: Mixed, options?: Object | undefined): void;
    /**
     * Remove existing cookie using it's key
     *
     * @method clearCookie
     *
     * @param  {String}    key
     *
     * @param  {Object}    [options = {}]
     *
     * @return {void}
     */
    clearCookie(key: string, options?: Object | undefined): void;
    /**
     * Aborts the request (when expression is truthy) by throwing an exception.
     * Since AdonisJs allows exceptions to handle themselves, it simply makes
     * an response when handling itself.
     *
     * @method abortIf
     *
     * @param  {Mixed} expression
     * @param  {Number} status
     * @param  {Mixed} body
     *
     * @return {void}
     *
     * @throws {AbortException} If expression is thruthy
     */
    abortIf(expression: Mixed, status: number, body: Mixed): void;
    /**
     * Aborts the request (when expression is falsy) by throwing an exception.
     * Since AdonisJs allows exceptions to handle themselves, it simply makes
     * an response when handling itself.
     *
     * @method abortUnless
     *
     * @param  {Mixed} expression
     * @param  {Number} status
     * @param  {Mixed} body
     *
     * @return {void}
     *
     * @throws {AbortException} If expression is falsy
     */
    abortUnless(expression: Mixed, status: number, body: Mixed): void;
    
    ok(): void;
}
declare namespace Response {
    const _macros: Object;
    const _getters: {};
}
