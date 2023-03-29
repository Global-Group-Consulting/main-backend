export = BaseScheme;
/**
 * The base scheme is supposed to be extend by other
 * schemes.
 *
 * @class BaseScheme
 * @constructor
 * @module Lucid
 */
declare class BaseScheme {
    _config: Object | null;
    _serializerInstance: Object | null;
    _instanceUser: any;
    _ctx: Object | null;
    /**
     * The uid field name. Reads the `uid` from the config object
     *
     * @attribute uidField
     * @readOnly
     * @type {String}
     */
    get uidField(): string;
    /**
     * The password field name. Reads the `password` from the config object
     *
     * @attribute passwordField
     * @readOnly
     * @type {String}
     */
    get passwordField(): string;
    /**
     * The scheme field name. Reads the `scheme` from the config object
     *
     * @attribute scheme
     * @readOnly
     * @type {String}
     */
    get scheme(): string;
    /**
     * The primary key to be used to fetch the unique identifier value
     * for the current user.
     *
     * @attribute primaryKey
     * @readOnly
     * @type {String}
     */
    get primaryKey(): string;
    /**
     * The unique identifier value for the current user. The value relies on
     * primaryKey.
     *
     * @attribute primaryKeyValue
     * @readOnly
     * @type {String|Number}
     */
    get primaryKeyValue(): string | number;
    set user(arg: Mixed);
    /**
     * Reference to the current user instance. The output value relies
     * on the serializer in use.
     *
     * @attribute user
     * @return {Mixed}
     */
    get user(): Mixed;
    /**
     * Set the config and the serializer instance on scheme. This method
     * is invoked by the `Auth` facade to feed the current config and
     * serializer in use.
     *
     * @method setOptions
     *
     * @param  {Object}   config
     * @param  {Object}   serializerInstance
     *
     * @chainable
     */
    setOptions(config: Object, serializerInstance: Object): BaseScheme;
    /**
     * Set http context on the scheme instance. This
     * method is called automatically by `Auth`
     * facade.
     *
     * @method setCtx
     *
     * @param  {Object}   ctx
     *
     * @chainable
     */
    setCtx(ctx: Object): BaseScheme;
    /**
     * Attach a callback to add runtime constraints
     * to the query builder.
     *
     * @method query
     *
     * @param  {Function} callback
     *
     * @chainable
     *
     * @example
     * ```js
     * auth.query((builder) => {
     *   builder.status('active')
     * }).attempt()
     * ```
     */
    query(callback: Function): BaseScheme;
    /**
     * Validates the user credentials.
     *
     * This method will never login the user.
     *
     * @method validate
     * @async
     *
     * @param  {String}  uid
     * @param  {String}  password
     * @param  {Boolean} [returnUser = false]
     *
     * @return {Object|Boolean} - User object is returned when `returnUser` is set to true.
     *
     * @throws {UserNotFoundException}     If unable to find user with uid
     * @throws {PasswordMisMatchException} If password mismatches
     *
     * @example
     * ```js
     * try {
     *   await auth.validate(username, password)
     * } catch (error) {
     *   // Invalid credentials
     * }
     * ```
     */
    validate(uid: string, password: string, returnUser?: boolean | undefined): Object | boolean;
    /**
     * Returns the user logged in for the current request. This method will
     * call the `check` method internally.
     *
     * @method getUser
     * @async
     *
     * @return {Object}
     *
     * @example
     * ```js
   *   await auth.getUser()
     * ```
     */
    getUser(): Object;
    /**
     * Returns the value of authorization header
     * or request payload token key value.
     *
     * This method will read the value of `Authorization` header, falling
     * back to `token` input field.
     *
     * @method getAuthHeader
     *
     * @param {Array} authTypes
     *
     * @return {String|Null}
     */
    getAuthHeader(authTypes: any[]): string | null;
    /**
     * Raises UserNotFoundException exception and pass required data to it
     *
     * @method missingUserFor
     *
     * @param  {String|Number}    uidValue
     * @param  {String}           [uid=this._config.uid]
     * @param  {String}           [password=this._config.password]
     *
     * @return {UserNotFoundException}
     */
    missingUserFor(uidValue: string | number, uid?: string | undefined, password?: string | undefined): UserNotFoundException;
    /**
     * Raises PasswordMisMatchException exception and pass required data to it
     *
     * @method invalidPassword
     *
     * @param  {String}        message
     * @param  {String}        [password=this._config.password]
     *
     * @return {PasswordMisMatchException}
     */
    invalidPassword(password?: string | undefined): PasswordMisMatchException;
}
