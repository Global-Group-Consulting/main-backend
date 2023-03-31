export = BasicAuthScheme;
/**
 * Authenticates a given HTTP request using [Basic Auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) headers.
 *
 * @class BasicAuthScheme
 * @extends BaseScheme
 */
declare class BasicAuthScheme extends BaseScheme {
    /**
     * Check whether a user is logged in or
     * not.
     *
     * Consider user as successfully authenticated, if this
     * method doesn't throws an exception.
     *
     * @method check
     * @async
     *
     * @return {Boolean}
     *
     * @throws {InvalidBasicAuthException} If credentails are missing
     * @throws {UserNotFoundException}     If unable to find user with uid
     * @throws {PasswordMisMatchException} If password mismatches
     *
     * @example
     * ```js
     * try {
     *  await auth.check()
     * } catch (error) {
     *   // Missing or invalid credentials
     * }
     * ```
     */
    check(): boolean;
    /**
     * Same as {{#crossLink "BasicAuthScheme/check:method"}}{{/crossLink}},
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
     * Login as a user by setting basic auth header
     * before the request reaches the server.
     *
     * Adonis testing engine uses this method.
     *
     * @param  {Function}    headerFn     - Method to set the header
     * @param  {Function}    sessionFn    - Method to set the session
     * @param  {String}      username
     * @param  {String}      password
     *
     * @method clientLogin
     * @async
     *
     * @return {void}
     */
    clientLogin(headerFn: Function, sessionFn: Function, username: string, password: string): void;
}
import BaseScheme = require("./Base");
