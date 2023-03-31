export = SessionScheme;
/**
 * This scheme allows to make use of `sessions` to authenticate
 * a user.
 *
 * The authentication is stateful and logged in user `id` is saved inside
 * cookies to maintain the state across multiple requests.
 *
 * @class SessionScheme
 * @extends BaseScheme
 */
declare class SessionScheme extends BaseScheme {
    /**
     * Injections via IoC container
     *
     * @method inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Config: any);
    _cookieOptions: any;
    _rememberTokenDuration: any;
    /**
     * Reference to the value of `sessionKey` inside the config block.
     * Defaults to `adonis-auth`
     *
     * @attribute sessionKey
     * @readOnly
     * @return {String}
     */
    get sessionKey(): string;
    /**
     * Reference to the value of `rememberMeToken` inside the config block.
     * Defaults to `adonis-remember-token`
     *
     * @attribute rememberTokenKey
     * @readOnly
     * @return {String}
     */
    get rememberTokenKey(): string;
    /**
     * Set authentication session on user instance. Remember me cookie
     * will be saved if `rememberToken` and `duration` are provided.
     *
     * @method _setSession
     *
     * @param  {Number|String}    primaryKeyValue
     * @param  {String}           [rememberToken]
     * @param  {Number}           [duration]
     *
     * @returns {void}
     *
     * @private
     */
    private _setSession;
    /**
     * Removes the login session and remember me cookie.
     *
     * @method _removeSession
     *
     * @return {void}
     *
     * @private
     */
    private _removeSession;
    /**
     * Instruct login API to remember the user for a given
     * duration. Defaults to `5years`.
     *
     * This method must be called before `login`, `loginViaId` or
     * `attempt` method.
     *
     * @method remember
     *
     * @param  {String|Number} [duration = 5y]
     *
     * @chainable
     *
     * @example
     * ```js
     * await auth.remember(true).login()
     *
     * // custom durating
     * await auth.remember('2y').login()
     * ```
     */
    remember(duration?: string | number | undefined): SessionScheme;
    /**
     * Attempt to login the user using `username` and `password`. An
     * exception will be raised when unable to find the user or
     * if password mis-matches.
     *
     * @method attempt
     * @async
     *
     * @param  {String} uid
     * @param  {String} password
     *
     * @return {Object}
     *
     * @throws {UserNotFoundException}     If unable to find user with uid
     * @throws {PasswordMisMatchException} If password mismatches
     *
     * @example
     * ```js
     * try {
     *   await auth.attempt(username, password)
     * } catch (error) {
     *   // Invalid credentials
     * }
     * ```
     */
    attempt(uid: string, password: string): Object;
    /**
     * Login the user using the user object. An exception will be
     * raised if the same user is already logged in.
     *
     * The exception is raised to improve your code flow, since your code
     * should never try to login a same user twice.
     *
     * @method login
     *
     * @param  {Object} user
     * @async
     *
     * @return {Object}
     *
     * @example
     * ```js
     * try {
     *   await auth.login(user)
     * } catch (error) {
     *   // Unexpected error
     * }
     * ```
     */
    login(user: Object): Object;
    /**
     * Login a user with their unique id.
     *
     * @method loginViaId
     * @async
     *
     * @param  {Number|String}   id
     *
     * @return {Object}
     *
     * @throws {UserNotFoundException}     If unable to find user with id
     *
     * @example
     * ```js
     * try {
     *   await auth.loginViaId(1)
     * } catch (error) {
     *   // Unexpected error
     * }
     * ```
     */
    loginViaId(id: number | string): Object;
    /**
     * Logout a user by removing the required cookies. Also remember
     * me token will be deleted from the tokens table.
     *
     * @method logout
     * @async
     *
     * @return {void}
     *
     * @example
     * ```js
     * await auth.logout()
     * ```
     */
    logout(): void;
    /**
     * Check whether the user is logged in or not. If the user session
     * has been expired, but a valid `rememberMe` token exists, this
     * method will re-login the user.
     *
     * @method check
     * @async
     *
     * @return {Boolean}
     *
     * @throws {InvalidSessionException} If session is not valid anymore
     *
     * @example
     * ```js
     * try {
     *   await auth.check()
     * } catch (error) {
     *   // user is not logged
     * }
     * ```
     */
    check(): boolean;
    /**
     * Same as {{#crossLink "SessionScheme/check:method"}}{{/crossLink}},
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
     * Login a user as a client. This is required when
     * you want to set the session on a request that
     * will reach the Adonis server.
     *
     * Adonis testing engine uses this method.
     *
     * @method clientLogin
     * @async
     *
     * @param  {Function}    headerFn     - Method to set the header
     * @param  {Function}    sessionFn    - Method to set the session
     * @param  {Object}      user         - User to login
     *
     * @return {void}
     */
    clientLogin(headerFn: Function, sessionFn: Function, user: Object): void;
}
import BaseScheme = require("./Base");
