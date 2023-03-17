export = Shield;
declare class Shield {
    constructor(Config: any);
    config: any;
    cspNonce: any;
    appSecret: any;
    /**
     * The session key name for storing the CSRF
     * secret
     *
     * @method sessionKey
     *
     * @return {String}
     */
    get sessionKey(): string;
    /**
     * Returns the keys to be used for CSP headers, based
     * upon the user configuration
     *
     * @method _getHeaderKeys
     *
     * @param  {Object}       headers
     *
     * @return {Array}
     *
     * @private
     */
    private _getHeaderKeys;
    /**
     * Returns a boolean telling whether CSRF is enabled
     * or not
     *
     * @method _isCsrfEnabled
     *
     * @return {Boolean}
     *
     * @private
     */
    private _isCsrfEnabled;
    /**
     * Returns whether the request method falls within
     * the defined methods in the config
     *
     * @method _fallsUnderValidationMethod
     *
     * @param  {String}           method
     *
     * @return {Boolean}
     *
     * @private
     */
    private _fallsUnderValidationMethod;
    /**
     * Returns a boolean telling if the current request
     * url is supposed to be selected for csrf token
     * validation or not
     *
     * @method _fallsUnderValidationUri
     *
     * @param  {Object}                 request
     *
     * @return {Boolean}
     *
     * @private
     */
    private _fallsUnderValidationUri;
    /**
     * Set response headers to guard the webpages from various
     * web attacks. This method will set one or all of the
     * following headers based upon the config settings.
     *
     * 1. X-XSS-Protection
     * 2. X-Frame-Options
     * 3. X-Content-Type-Options
     * 4. X-DOWNLOAD-OPTIONS
     *
     * @method setGuardHeaders
     *
     * @param  {Object}        req
     * @param  {Object}        res
     *
     * @return {void}
     */
    setGuardHeaders(req: Object, res: Object): void;
    /**
     * Builds the CSP string and returns them as an object
     * with multiple HTTP headers as keys.
     *
     * All headers may not required, since headers starting
     * with `X` are for backward compatibility.
     *
     * @method buildCsp
     *
     * @param  {Object} req
     * @param  {Object} res
     *
     * @return {Object}
     */
    buildCsp(req: Object, res: Object): Object;
    /**
     * Set's CSP headers on response
     *
     * @method setCspHeaders
     *
     * @param  {Object}      headers
     * @param  {Object}      response
     *
     * @return {void}
     */
    setCspHeaders(headers: Object, response: Object): void;
    /**
     * Shares csp related views with the view instance
     *
     * @method shareCspViewLocals
     *
     * @param  {Object}           headers
     * @param  {Object}           view
     *
     * @return {void}
     */
    shareCspViewLocals(headers: Object, view: Object): void;
    /**
     * Sets csp nonce value on request instance
     *
     * @method setRequestNonce
     *
     * @param  {Object}              request
     */
    setRequestNonce(request: Object): void;
    /**
     * Generates a new csrf secret only when it doesn't
     * exists for the current user session.
     *
     * This method will set the secret inside the session
     * too.
     *
     * So what you will it? umm....., ohh it has side-effects :)
     *
     * @method getCsrfSecret
     *
     * @param  {Object}      session
     *
     * @return {String}
     */
    getCsrfSecret(session: Object): string;
    /**
     * Generates a new csrf token for a given
     * secret
     *
     * @method generateCsrfToken
     *
     * @param  {String}          secret
     *
     * @return {String}
     */
    generateCsrfToken(secret: string): string;
    /**
     * Verifies the user token with the session secret.
     *
     * This method internally uses `tsscmp` which saves users from
     * timing attacks.
     *
     * @method verifyToken
     *
     * @param  {String}    secret
     * @param  {String}    token
     *
     * @return {void}
     *
     * @throws {HttpException} If unable to verify secret
     */
    verifyToken(secret: string, token: string): void;
    /**
     * Returns the csrf token by reading it from one of expected
     * resources.
     *
     * @method getCsrfToken
     *
     * @param  {Object} request
     *
     * @return {String|Null}
     */
    getCsrfToken(request: Object): string | null;
    /**
     * Shares `csrfToken` and `csrfField` locals with
     * the view instance
     *
     * @method shareCsrfViewLocals
     *
     * @param  {String}             csrfToken
     * @param  {Object}             view
     *
     * @return {void}
     */
    shareCsrfViewLocals(csrfToken: string, view: Object): void;
    /**
     * Sets the Csrf cookie on the response, this value is
     * used automatically by frontend frameworks like
     * Angular.
     *
     * Note: Since all cookies the signed and encrypted, so csrf
     * token is encrypted too and when sent back as a header,
     * this module will decrypt it automatically, so your
     * life is good in short :).
     *
     * @method setCsrfCookie
     *
     * @param  {String}       csrfToken
     * @param  {Object}       response
     */
    setCsrfCookie(csrfToken: string, response: Object): void;
    /**
     * Sets the token on the request object
     *
     * @method setRequestCsrfToken
     *
     * @param  {String}            csrfToken
     * @param  {Object}            request
     *
     * @return {void}
     */
    setRequestCsrfToken(csrfToken: string, request: Object): void;
    handle({ request, response, session, view }: {
        request: any;
        response: any;
        session: any;
        view: any;
    }, next: any): Promise<void>;
}
