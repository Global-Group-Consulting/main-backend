export = Request;
/**
 * A facade over Node.js HTTP `req` object, making it
 * easier and simpler to access request information.
 * You can access the original **req** object as
 * `request.request`
 *
 * @binding Adonis/Src/Request
 * @group Http
 *
 * @class Request
 * @constructor
 */
declare class Request {
    constructor(request: any, response: any, Config: any);
    /**
     * Reference to native HTTP request object
     *
     * @attribute request
     * @type {Object}
     */
    request: Object;
    /**
     * Reference to route params. This will be set by server
     * automatically once the route has been resolved.
     *
     * @attribute params
     * @type {Object}
     */
    params: Object;
    /**
     * Reference to native HTTP response object
     *
     * @attribute response
     * @type {Object}
     */
    response: Object;
    /**
     * Reference to config provider to read
     * http specific settings.
     *
     * @attribute Config
     * @type {Object}
     */
    Config: Object;
    /**
     * The qs object
     *
     * @type {Object}
     */
    _qs: Object;
    /**
     * Reference to request body
     *
     * @type {Object}
     */
    _body: Object;
    /**
     * Reference to raw body
     *
     * @type {Object}
     */
    _raw: Object;
    /**
     * A merged object of get and post. This will re-computed everytime we will
     * update the `qs` or `body` properties on this class.
     *
     * @type {Object}
     */
    _all: Object;
    /**
     * A reference to the original request object. The object will be freezed for further
     * modifications once computed
     *
     * @type {Object}
     */
    _original: Object;
    /**
     * Tracking whether initial qs and body has been
     * set or not
     *
     * @type {Object}
     */
    _originalCalls: Object;
    /**
     * Update the query string. This will re-compute the
     * _all
     *
     * @method qs
     *
     * @param  {Object} qs
     *
     * @return {void}
     */
    set qs(arg: Objec);
    /**
     * Returns the query string as an object
     *
     * @method qs
     *
     * @return {Objec}
     */
    get qs(): Objec;
    /**
     * Mutate request body, this method will
     * mutate the `all` object as well
     *
     * @method body
     *
     * @param  {Object} body
     *
     * @return {void}
     */
    set body(arg: Object);
    /**
     * Request body
     *
     * @method body
     *
     * @return {Object}
     */
    get body(): Object;
    /**
     * Updates the request original payload by tracking the
     * amount of mutations made to it. Once `qs` and `body`
     * is set for the first time, after that original
     * object will be freexed
     *
     * @method _updateRequestOriginal
     *
     * @return {void}
     *
     * @private
     */
    private _updateRequestOriginal;
    /**
     * Returns a boolean indicating if user is a bad safari.
     * This method is used by the `fresh` method to address
     * a known bug in safari described [here](http://tech.vg.no/2013/10/02/ios7-bug-shows-white-page-when-getting-304-not-modified-from-server/)
     *
     * @method _isBadSafari
     *
     * @return {Boolean}
     *
     * @private
     */
    private _isBadSafari;
    /**
     * Returns query params from HTTP url.
     *
     * @method get
     *
     * @return {Object}
     *
     * @example
     * ```js
     * request.get()
     * ```
     */
    get(): Object;
    /**
     * Returns an object of request body. This method
     * does not parses the request body and instead
     * depends upon the body parser middleware
     * to set the private `_body` property.
     *
     * No it's not against the law of programming, since AdonisJs
     * by default is shipped with body parser middleware.
     *
     * @method post
     *
     * @return {Object}
     *
     * @example
     * ```js
     * request.body()
     * ```
     */
    post(): Object;
    /**
     * Similar to `request.all`, but later mutations are avoided. Use this
     * method, when you want to read the values submitted in the original
     * HTTP request.
     *
     * @method original
     *
     * @return {Object}
     */
    original(): Object;
    /**
     * Returns an object after merging {{#crossLink "Request/get"}}{{/crossLink}} and
     * {{#crossLink "Request/post"}}{{/crossLink}} values
     *
     * @method all
     *
     * @return {Object}
     *
     * @example
     * ```js
     * request.all()
     * ```
     */
    all(): Object;
    /**
     * Returns request raw body
     *
     * @method raw
     *
     * @return {Object}
     */
    raw(): Object;
    /**
     * Returns an array of key/value pairs for the defined keys.
     * This method is super helpful when your HTML forms sends
     * an array of values and you want them as individual
     * objects to be saved directly via Lucid models.
     *
     * # Note
     * This method always returns a stable array by setting value for
     * `undefined` keys to `null`. For example your data payload has
     * 3 emails and 2 usernames, the final array will have 3
     * objects with all the emails and the last object will
     * have `username` set to `null`.
     *
     * @method collect
     *
     * @param  {Array} keys
     *
     * @return {Array}
     *
     * @example
     * ```js
     * // data {username: ['virk', 'nikk'], age: [26, 25]}
     * const users = request.collect(['username', 'age'])
     * // returns [{username: 'virk', age: 26}, {username: 'nikk', age: 25}]
     * ```
     */
    collect(keys: any[]): any[];
    /**
     * Returns the value from the request body or
     * query string, but only for a single key.
     *
     * @method input
     *
     * @param {String} key
     * @param {Mixed}  [defaultValue]
     *
     * @return {Mixed} Actual value or the default value falling back to `null`
     */
    input(key: string, defaultValue?: any): Mixed;
    /**
     * Returns everything from request body and query
     * string except the given keys.
     *
     * @param {Array} keys
     *
     * @method except
     *
     * @return {Object}
     *
     * @example
     * ```js
     * request.except(['username', 'age'])
     * ```
     */
    except(keys: any[]): Object;
    /**
     * Returns value for only given keys.
     *
     * @method only
     *
     * @param  {Array} keys
     *
     * @return {Object}
     *
     * @example
     * ```js
     * request.only(['username', 'age'])
     * ```
     */
    only(keys: any[]): Object;
    /**
     * Returns the http request method, it will give preference
     * to spoofed method when `http.allowMethodSpoofing` is
     * enabled inside the `config/app.js` file.
     *
     * Make use of {{#crossLink "Request/intended"}}{{/crossLink}} to
     * get the actual method.
     *
     * @method method
     *
     * @return {String} Request method always in uppercase
     */
    method(): string;
    /**
     * Returns the intended method for HTTP request. This method
     * is useful when you have method spoofing enabled and wants
     * the actual request method.
     *
     * @method intended
     *
     * @return {String} Request method always in uppercase
     */
    intended(): string;
    /**
     * Returns HTTP request headers.
     *
     * @method headers
     *
     * @return {Object}
     */
    headers(): Object;
    /**
     * Returns header value for a given key.
     *
     * @method header
     *
     * @param  {String} key
     * @param  {Mixed} [defaultValue]
     *
     * @return {Mixed} Actual value or the default value, falling back to `null`
     */
    header(key: string, defaultValue?: any): Mixed;
    /**
     * Returns the most trusted ip address for a given
     * HTTP request.
     *
     * @method ip
     *
     * @param {Trust} [trust = Config.get('app.http.trustProxy')]
     *
     * @return {String}
     */
    ip(trust?: any): string;
    /**
     * Returns an array of ips from most to the least trust one.
     * It will remove the default ip address, which can be
     * accessed via `ip` method.
     *
     * Also when trust is set to true, It will look into `X-Forwaded-For`
     * header to pull the ip address set by client or your proxy server.
     *
     * @method ips
     *
     * @param {Trust} [trust = Config.get('app.http.trustProxy')]
     *
     * @return {Array}
     */
    ips(trust?: any): any[];
    /**
     * Returns the protocol for the request.
     *
     * @method protocol
     *
     * @param  {Trust} [trust = Config.get('app.http.trustProxy')]
     *
     * @return {String}
     */
    protocol(trust?: any): string;
    /**
     * Returns a boolean indicating whether request is
     * on https or not
     *
     * @method secure
     *
     * @return {Boolean}
     */
    secure(): boolean;
    /**
     * Returns an array of subdomains. It will exclude `www`
     * from the list.
     *
     * @method subdomains
     *
     * @param  {Trust}   [trust = Config.get('app.http.trustProxy')]
     * @param  {Number}  [offset = Config.get('app.http.subdomainOffset')]
     *
     * @return {Array}
     */
    subdomains(trust?: any, offset?: number | undefined): any[];
    /**
     * Returns a boolean indicating whether request
     * is ajax or not.
     *
     * @method ajax
     *
     * @return {Boolean}
     */
    ajax(): boolean;
    /**
     * Returns a boolean indicating whether request
     * is pjax or not.
     *
     * @method pjax
     *
     * @return {Boolean}
     */
    pjax(): boolean;
    /**
     * Returns the hostname for the request
     *
     * @method hostname
     *
     * @param  {Mixed} [trust = Config.get('app.http.trustProxy')]
     *
     * @return {String}
     */
    hostname(trust?: any): string;
    /**
     * Returns url without query string for the HTTP request.
     *
     * @method url
     *
     * @return {String}
     */
    url(): string;
    /**
     * Returns originalUrl for the HTTP request.
     *
     * @method originalUrl
     *
     * @return {String}
     */
    originalUrl(): string;
    /**
     * Check the request body type based upon http
     * `Content-type` header.
     *
     * @method is
     *
     * @param  {Array}  [types]
     *
     * @return {String}
     *
     * @example
     * ```js
     * // request.headers.content-type = 'application/json'
     *
     * request.is(['json']) // json
     * request.is(['json', 'html']) // json
     * request.is(['application/*']) // application/json
     *
     * request.is(['html']) // '<empty string>'
     * ```
     */
    is(types?: any[] | undefined): string;
    /**
     * Returns the best accepted response type based from
     * the `Accept` header. If no `types` are provided
     * the return value will be array containing all
     * the `Accept` header values.
     *
     * @method accepts
     *
     * @param  {Array} [types]
     *
     * @return {String|Array}
     */
    accepts(types?: any[] | undefined): string | any[];
    /**
     * Similar to `accepts`, but always returns an array of
     * values from `Accept` header, starting from most
     * preferred from least.
     *
     * @method types
     *
     * @return {Array}
     */
    types(): any[];
    /**
     * Returns request language based upon HTTP `Accept-Language`
     * header. This method will filter from the list of
     * acceptedLanguages array.
     *
     * @method language
     *
     * @param  {Array} [acceptedLanguages]
     *
     * @return {String}
     */
    language(acceptedLanguages?: any[] | undefined): string;
    /**
     * Returns an array of request languages based on HTTP `Accept-Language`
     * header.
     *
     * @method languages
     *
     * @return {Array}
     */
    languages(): any[];
    /**
     * Returns most preferred encoding based upon `Accept-Encoding`
     * header. This method will filter encodings based upon on
     * the acceptedEncodings string
     *
     * @method encoding
     *
     * @param  {Array} [acceptedEncodings]
     *
     * @return {String}
     */
    encoding(acceptedEncodings?: any[] | undefined): string;
    /**
     * Returns an array of encodings based upon `Accept-Encoding`
     * header.
     *
     * @method encodings
     *
     * @return {Array}
     */
    encodings(): any[];
    /**
     * Returns most preferred charset based upon the `Accept-Charset`
     * header. This method will filter from the list of acceptedCharsets
     * parameter.
     *
     * @method charset
     *
     * @param  {Array} acceptedCharsets
     *
     * @return {String}
     */
    charset(acceptedCharsets: any[]): string;
    /**
     * Returns an array of charsets based upon `Accept-Charset`
     * header.
     *
     * @method charsets
     *
     * @return {Array}
     */
    charsets(): any[];
    /**
     * Returns a boolean indicating whether request has
     * body or not
     *
     * @method hasBody
     *
     * @return {Boolean}
     */
    hasBody(): boolean;
    /**
     * Returns an object of all the cookies. Make sure always
     * to define the `secret` inside `config/app.js` file,
     * since all cookies are signed and encrypted.
     *
     * This method will make use of `app.secret` from the config
     * directory.
     *
     * @method cookies
     *
     * @return {Object}
     */
    cookies(): Object;
    /**
     * Returns cookies without decrypting or unsigning them
     *
     * @method plainCookies
     *
     * @return {Object}
     */
    plainCookies(): Object;
    /**
     * Returns cookie value for a given key.
     *
     * This method will make use of `app.secret` from the config
     * directory.
     *
     * @method cookie
     *
     * @param  {String} key
     * @param  {Mixed} [defaultValue]
     *
     * @return {Mixed}
     */
    cookie(key: string, defaultValue?: any): Mixed;
    /**
     * Return raw value for a given key. Cookie will not be
     * encrypted or unsigned.
     *
     * @method plainCookie
     *
     * @param  {String}    key
     * @param  {Mixed}     [defaultValue]
     *
     * @return {Mixed}
     */
    plainCookie(key: string, defaultValue?: any): Mixed;
    /**
     * Returns a boolean indicating whether request url
     * matches any of the given route formats.
     *
     * @method match
     *
     * @param  {Array} routes
     *
     * @return {Boolean}
     *
     * @example
     * ```js
     * request.match(['/user/:id', 'user/(+.)'])
     * ```
     */
    match(routes: any[]): boolean;
    /**
     * Returns the freshness of a response inside the client cache.
     * If client cache has the latest response, this method will
     * return true, otherwise it will return false.
     *
     *
     * Also when HTTP header Cache-Control: no-cache is present this method will return false everytime.
     *
     * @method fresh
     *
     * @return {Boolean}
     */
    fresh(): boolean;
    /**
     * The opposite of {{#crossLink "Request/fresh"}}{{/crossLink}} method.
     *
     * @method stale
     *
     * @return {Boolean}
     */
    stale(): boolean;
    /**
     * Returns the request format from the URL params
     *
     * @method format
     *
     * @return {String}
     */
    format(): string;
}
