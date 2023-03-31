export = ApiScheme;
/**
 * This scheme allows to make use of Github style personal API tokens
 * to authenticate a user.
 *
 * The tokens for a give user are stored inside the database and user sends
 * a token inside the `Authorization` header as following.
 *
 * ```
 * Authorization=Bearer TOKEN
 * ```
 *
 * ### Note
 * Token will be encrypted using `EncryptionProvider` before sending it to the user.
 *
 * @class ApiScheme
 * @extends BaseScheme
 */
declare class ApiScheme {
    /**
     * Attempt to valid the user credentials and then
     * generates a new token for it.
     *
     * This method invokes the `generate` method by passing
     * the user found with given credentials.
     *
     * @method attempt
     * @async
     *
     * @param  {String} uid
     * @param  {String} password
     *
     * @return {Object}
     *
     * @example
     * ```js
     * try {
     *   const token = auth.attempt(username, password)
     * } catch (error) {
     *   // Invalid credentials
     * }
     * ```
     */
    attempt(uid: string, password: string): Object;
    /**
     * Generates a personal API token for a user. The user payload must
     * be valid as per the serializer in use.
     *
     * @method generate
     * @async
     *
     * @param  {Object} user
     *
     * @return {Object}
     * - `{ type: 'bearer', token: 'xxxxxxxx' }`
     *
     * @example
     * ```js
     * try {
     *   const user = await User.find(1)
     *   const token = await auth.generate(user)
     * } catch (error) {
     *   // Unexpected error
     * }
     * ```
     */
    generate(user: Object): Object;
    /**
     * Validates the API token by reading it from the request
     * header or using `token` input field as the fallback.
     *
     * Consider user as successfully authenticated, if this
     * method doesn't throws an exception.
     *
     * @method check
     * @async
     *
     * @return {void}
     *
     * @throws {InvalidApiToken} If token is missing or is invalid
     *
     * @example
     * ```js
     * try {
     *   await auth.check()
     * } catch (error) {
     *   // Invalid token
     * }
     * ```
     */
    check(): void;
    user: any;
    /**
     * Same as {{#crossLink "ApiScheme/check:method"}}{{/crossLink}},
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
     * List all API tokens for a given user
     *
     * @method listTokensForUser
     * @async
     *
     * @param {Object} user
     *
     * @return {Array}
     */
    listTokensForUser(user: Object): any[];
    /**
     * Login a user as a client. This method will set the
     * API token as a header on the request.
     *
     * Adonis testing engine uses this method.
     *
     * @method clientLogin
     * @async
     *
     * @param  {Function}    headerFn       - Method to set the header
     * @param  {Function}    sessionFn      - Method to set the session
     * @param  {Object}      tokenOrUser    - Pass the token or the user directly
     *
     * @return {void}
     */
    clientLogin(headerFn: Function, sessionFn: Function, tokenOrUser: Object): void;
}
