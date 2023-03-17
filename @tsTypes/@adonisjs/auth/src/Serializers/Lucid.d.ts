export = LucidSerializer;
/**
 * Database serializer uses the Lucid models provider to fetch
 * user and tokens from the database.
 *
 * @class LucidSerializer
 * @constructor
 * @module Lucid
 *
 * @param {Object} Hash Hash provider
 */
declare class LucidSerializer {
    /**
     * Dependencies to be injected by Ioc container
     *
     * @attribute inject
     * @type {Array}
     * @readOnly
     *
     * @ignore
     * @static
     */
    static get inject(): any[];
    constructor(Hash: any);
    Hash: any;
    _config: Object | null;
    _Model: any;
    _queryCallback: Function | null;
    /**
     * Returns an instance of the model query
     *
     * @method _getQuery
     *
     * @param  {String} [table = this.table]
     *
     * @return {Object}
     *
     * @private
     */
    private _getQuery;
    /**
     * Returns a query by selecting the right set of tokens
     * for a given user.
     *
     * @method _selectTokens
     *
     * @param  {Object}        user
     * @param  {Array}         [tokens]             - Scope to given tokens only
     * @param  {Boolean}       [inverse = false]    - Inverse the scope
     *
     * @return {Object}
     *
     * @private
     */
    private _selectTokens;
    /**
     * Reference to the primary key used for fetching the unique value
     * for a given user.
     *
     * @attribute primaryKey
     * @type {String}
     * @readOnly
     */
    get primaryKey(): string;
    /**
     * Sets the config based upon the authenticator in use. The Auth
     * facade calls this method and passes the config.
     *
     * @method setConfig
     *
     * @param  {Object}  config
     *
     * @return {void}
     */
    setConfig(config: Object): void;
    /**
     * Add runtime constraints to the query builder. It
     * is helpful when auth has extra constraints too.
     *
     * The `query` method called directly on the auth instance, which
     * internally calls this method on the serializer.
     *
     * @method query
     *
     * @param  {Function} callback
     *
     * @chainable
     *
     * @example
     *
     * ```js
     * auth.query((builder) => {
     *   builder.status('active')
     * }).attempt()
     * ```
     */
    query(callback: Function): LucidSerializer;
    /**
     * Returns a user instance using the primary
     * key
     *
     * @method findById
     * @async
     *
     * @param  {Number|String} id
     *
     * @return {User|Null}
     */
    findById(id: number | string): User | null;
    /**
     * Finds a user using the uid field
     *
     * @method findByUid
     * @async
     *
     * @param  {String}  uid
     *
     * @return {Model|Null} The model instance or `null`
     */
    findByUid(uid: string): Model | null;
    /**
     * Validates the password field on the user model instance
     *
     * @method validateCredentails
     * @async
     *
     * @param  {Model}            user
     * @param  {String}           password
     *
     * @return {Boolean}
     */
    validateCredentails(user: Model, password: string): boolean;
    /**
     * Finds a user with token
     *
     * @method findByToken
     * @async
     *
     * @param  {String}    token
     * @param  {String}    type
     *
     * @return {Object|Null}
     */
    findByToken(token: string, type: string): Object | null;
    /**
     * Save token for a user. Tokens are usually secondary
     * way to login a user when their primary login is
     * expired
     *
     * @method saveToken
     * @async
     *
     * @param  {Object}  user
     * @param  {String}  token
     * @param  {String}  type
     *
     * @return {void}
     */
    saveToken(user: Object, token: string, type: string): void;
    /**
     * Revoke token(s) or all tokens for a given user
     *
     * @method revokeTokens
     *
     * @param  {Object}           user
     * @param  {Array|String}     [tokens = null] - If defined all these tokens are taken into account
     * @param  {Boolean}          [inverse = false] - If `true`, all tokens except the given tokens will be revoked
     *
     * @return {Number}           Number of impacted rows
     */
    revokeTokens(user: Object, tokens?: string | any[] | undefined, inverse?: boolean | undefined): number;
    /**
     * Delete token(s) or all tokens for a given user
     *
     * @method deleteTokens
     *
     * @param  {Object}           user
     * @param  {Array|String}     [tokens = null] - If defined all these tokens are taken into account
     * @param  {Boolean}          [inverse = false] - If `true`, all tokens except the given tokens will be removed
     *
     * @return {Number}           Number of impacted rows
     */
    deleteTokens(user: Object, tokens?: string | any[] | undefined, inverse?: boolean | undefined): number;
    /**
     * Returns all non-revoked list of tokens for a given user.
     *
     * @method listTokens
     * @async
     *
     * @param  {Object}   user
     * @param  {String}   type
     *
     * @return {Object}
     */
    listTokens(user: Object, type: string): Object;
}
