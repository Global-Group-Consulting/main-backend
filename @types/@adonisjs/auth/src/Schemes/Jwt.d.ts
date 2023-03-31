export = JwtScheme;
/**
 * This scheme allows to make use of JWT tokens to authenticate the user.
 *
 * The user sends a token inside the `Authorization` header as following.
 *
 * ```
 * Authorization=Bearer JWT-TOKEN
 * ```
 *
 * ### Note
 * Token will be encrypted using `EncryptionProvider` before sending it to the user.
 *
 * @class JwtScheme
 * @extends BaseScheme
 */
declare class JwtScheme {
    constructor(Encryption: any);
    _generateRefreshToken: any;
    /**
     * An object of jwt options directly
     * passed to `jsonwebtoken` library
     *
     * @attribute jwtOptions
     * @type {Object|Null}
     * @readOnly
     */
    get jwtOptions(): Object | null;
    /**
     * The jwt secret
     *
     * @attribute jwtSecret
     * @type {String|Null}
     * @readOnly
     */
    get jwtSecret(): string | null;
    /**
     * The jwt public
     *
     * @attribute jwtPublic
     * @type {String|Null}
     * @readOnly
     */
    get jwtPublic(): string | null;
    /**
     * Signs payload with jwtSecret using {{#crossLink "JwtScheme/jwtOptions:attribute"}}{{/crossLink}}
     *
     * @method _signToken
     * @async
     *
     * @param  {Object}   payload
     *
     * @returns  {String}
     *
     * @private
     */
    private _signToken;
    /**
     * Verifies the jwt token by decoding it
     *
     * @method _verifyToken
     * @async
     *
     * @param  {String}     token
     *
     * @return {Object}
     *
     * @private
     */
    private _verifyToken;
    /**
     * Saves jwt refresh token for a given user
     *
     * @method _saveRefreshToken
     *
     * @param  {Object}          user
     *
     * @return {String}
     *
     * @private
     */
    private _saveRefreshToken;
    /**
     * Instruct class to generate a refresh token
     * when generating the jwt token.
     *
     * @method withRefreshToken
     *
     * @chainable
     *
     * @example
     * ```js
     * await auth
     *   .withRefreshToken()
     *   .generate(user)
     *
     * // or
     * await auth
     *   .withRefreshToken()
     *   .attempt(username, password)
     * ```
     */
    withRefreshToken(): JwtScheme;
    /**
     * When issuing a new JWT token from the refresh token, this class will
     * re-use the old refresh token.
     *
     * If you want, you can instruct the class to generate a new refresh token
     * as well and remove the existing one from the DB.
     *
     * @method newRefreshToken
     *
     * @chainable
     *
     * @example
     * ```js
     * await auth
     *   .newRefreshToken()
     *   .generateForRefreshToken(token)
     * ```
     */
    newRefreshToken(): JwtScheme;
    /**
     * Attempt to valid the user credentials and then generate a JWT token.
     *
     * @method attempt
     * @async
     *
     * @param  {String} uid
     * @param  {String} password
     * @param  {Object|Boolean} [jwtPayload]  Pass true when want to attach user object in the payload
     *                                        or set a custom object.
     * @param  {Object}         [jwtOptions]  Passed directly to https://www.npmjs.com/package/jsonwebtoken
     *
     * @return {Object}
     * - `{ type: 'bearer', token: 'xxxx', refreshToken: 'xxxx' }`
     *
     * @example
     * ```js
     * try {
     *   const token = auth.attempt(username, password)
     * } catch (error) {
     *    // Invalid credentials
     * }
     * ```
     *
     * Attach user to the JWT payload
     * ```
     * auth.attempt(username, password, true)
     * ```
     *
     * Attach custom data object to the JWT payload
     * ```
     * auth.attempt(username, password, { ipAddress: '...' })
     * ```
     */
    attempt(uid: string, password: string, jwtPayload?: boolean | Object | undefined, jwtOptions?: Object | undefined): Object;
    /**
     * Generates a jwt token for a given user. This method doesn't check the existence
     * of the user in the database.
     *
     * @method generate
     * @async
     *
     * @param  {Object} user
     * @param  {Object|Boolean} [jwtPayload]  Pass true when want to attach user object in the payload
     *                                        or set a custom object.
     * @param  {Object}         [jwtOptions]  Passed directly to https://www.npmjs.com/package/jsonwebtoken
     *
     * @return {Object}
     * - `{ type: 'bearer', token: 'xxxx', refreshToken: 'xxxx' }`
     *
     * @throws {RuntimeException} If jwt secret is not defined or user doesn't have a primary key value
     *
     * @example
     * ```js
     * try {
     *   await auth.generate(user)
     * } catch (error) {
     *   // Unexpected error
     * }
     * ```
     *
     * Attach user to the JWT payload
     * ```
     * auth.auth.generate(user, true)
     * ```
     *
     * Attach custom data object to the JWT payload
     * ```
     * auth.generate(user, { ipAddress: '...' })
     * ```
     */
    generate(user: Object, jwtPayload?: boolean | Object | undefined, jwtOptions?: Object | undefined): Object;
    /**
     * Generate a new JWT token using the refresh token.
     *
     * If chained with {{#crossLink "JwtScheme/newRefreshToken"}}{{/crossLink}},
     * this method will remove the existing refresh token from database and issues a new one.
     *
     * @method generateForRefreshToken
     * @async
     *
     * @param {String} refreshToken
     * @param  {Object|Boolean} [jwtPayload]  Pass true when want to attach user object in the payload
     *                                        or set a custom object.
     * @param  {Object}         [jwtOptions]  Passed directly to https://www.npmjs.com/package/jsonwebtoken
     *
     * @return {Object}
     * - `{ type: 'bearer', token: 'xxxx', refreshToken: 'xxxx' }`
     *
     * @example
     * ```js
     * await auth.generateForRefreshToken(refreshToken)
     *
     * // create a new refresh token too
     * await auth
     *   .newRefreshToken()
     *   .generateForRefreshToken(refreshToken)
     * ```
     */
    generateForRefreshToken(refreshToken: string, jwtPayload?: boolean | Object | undefined, jwtOptions?: Object | undefined): Object;
    /**
     * Check if user is authenticated for the current HTTP request or not. This
     * method will read the token from the `Authorization` header or fallbacks
     * to the `token` input field.
     *
     * Consider user as successfully authenticated, if this
     * method doesn't throws an exception.
     *
     * @method check
     * @async
     *
     * @return {Boolean}
     *
     * @example
     * ```js
     * try {
     *   await auth.check()
     * } catch (error) {
     *   // invalid jwt token
     * }
     * ```
     */
    check(): boolean;
    jwtPayload: Object | undefined;
    user: any;
    /**
     * Same as {{#crossLink "JwtScheme/check:method"}}{{/crossLink}},
     * but doesn't throw any exceptions. This method is useful for
     * routes, where login is optional.
     *
     * @method loginIfCan
     * @async
     *
     * @return {Boolean}
     *
     * @example
     * ```js
   *   await auth.loginIfCan()
     * ```
     */
    loginIfCan(): boolean;
    /**
     * List all refresh tokens for a given user.
     *
     * @method listTokensForUser
     * @async
     *
     * @param  {Object} user
     *
     * @return {Array}
     */
    listTokensForUser(user: Object): any[];
    /**
     * Login a user as a client. This method will set the
     * JWT token as a header on the request.
     *
     * @param  {Function}    headerFn     - Method to set the header
     * @param  {Function}    sessionFn    - Method to set the session
     * @param  {Object}      user         - User to login
     * @param  {Object}      [jwtOptions] - Passed directly to https://www.npmjs.com/package/jsonwebtoken
     *
     * @method clientLogin
     * @async
     *
     * @return {void}
     */
    clientLogin(headerFn: Function, sessionFn: Function, user: Object): void;
}
