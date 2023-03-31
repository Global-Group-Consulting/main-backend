export = DatabaseSerializer;
/**
 * Database serializer uses the Database provider to fetch
 * user and tokens from the database.
 *
 * @class DatabaseSerializer
 * @constructor
 * @module Lucid
 *
 * @param {Object} Hash Hash provider
 */
declare class DatabaseSerializer {
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
    _queryCallback: Function | null;
    _Db: any;
    /**
     * Returns an instance of the model query
     *
     * @method _getQuery
     *
     * @return {Object}
     *
     * @private
     */
    private _getQuery;
    /**
     * Returns the query builder instance for the tokens table
     *
     * @method _getTokensQuery
     *
     * @return {Object}
     *
     * @private
     */
    private _getTokensQuery;
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
     * Connection to be used for making Database queries. This property
     * is a reference to the `connection` key inside the config file.
     *
     * @attribute connection
     * @type {String}
     * @readOnly
     */
    get connection(): string;
    /**
     * The table name for fetching users. This property is a reference
     * to the `table` key inside the config file.
     *
     * @attribute table
     * @type {String}
     * @readOnly
     */
    get table(): string;
    /**
     * The primary key to be used for finding the unique value for a give
     * user. This property is a reference to the `primaryKey` key inside
     * the config file.
     *
     * @attribute primaryKey
     * @type {String}
     * @readOnly
     */
    get primaryKey(): string;
    /**
     * The foreign key to be used for building a relation between user and
     * the tokens table. This property is a reference to the `foreignKey`
     * key inside the config file.
     *
     * @attribute foreignKey
     * @type {String}
     * @readOnly
     */
    get foreignKey(): string;
    /**
     * Name of table where tokens are stored. This property is a
     * reference to the `tokensTable` key inside the config file.
     *
     * @attribute tokensTable
     * @type {String}
     * @readOnly
     */
    get tokensTable(): string;
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
    query(callback: Function): DatabaseSerializer;
    /**
     * Returns a user instance using the primary
     * key.
     *
     * @method findById
     * @async
     *
     * @param  {Number|String} id
     *
     * @return {Object|Null}
     */
    findById(id: number | string): Object | null;
    /**
     * Finds a user using the uid field
     *
     * @method findByUid
     * @async
     *
     * @param  {String}  uid
     *
     * @return {Object|Null}
     */
    findByUid(uid: string): Object | null;
    /**
     * Validates the password field on the user model instance. This
     * method will make use of the `Hash` provider.
     *
     * @method validateCredentails
     * @async
     *
     * @param  {Model}             user
     * @param  {String}            password
     *
     * @return {Boolean}
     */
    validateCredentails(user: Model, password: string): boolean;
    /**
     * Finds a user with token.
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
     * Save token for a user.
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
     * @async
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
     * @async
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
     * - { rows: rows, toJSON: function () {} }
     */
    listTokens(user: Object, type: string): Object;
}
