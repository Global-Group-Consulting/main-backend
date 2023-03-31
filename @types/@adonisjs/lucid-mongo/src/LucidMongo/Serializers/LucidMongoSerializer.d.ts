export = LucidMongoSerializer;
/**
 * LucidMongo serializer uses lucidMongo model to validate
 * and fetch user details.
 *
 * @class LucidMongoSerializer
 * @constructor
 */
declare class LucidMongoSerializer {
    /**
     * Dependencies to be injected by Ioc container
     *
     * @attribute inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Hash: any);
    Hash: any;
    _config: Object | null;
    _Model: any;
    _Token: any;
    _queryCallback: Function | null;
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
     * Setup config on the serializer instance. It
     * is import and needs to be done as the
     * first step before using the serializer.
     *
     * @method setConfig
     *
     * @param  {Object}  config
     */
    setConfig(config: Object): void;
    /**
     * Returns the primary key for the
     * model. It is used to set the
     * session key
     *
     * @method primaryKey
     *
     * @return {String}
     */
    get primaryKey(): string;
    /**
     * Add runtime constraints to the query builder. It
     * is helpful when auth has extra constraints too
     *
     * @method query
     *
     * @param  {Function} callback
     *
     * @chainable
     */
    query(callback: Function): LucidMongoSerializer;
    /**
     * Returns a user instance using the primary
     * key
     *
     * @method findById
     *
     * @param  {Number|String} id
     *
     * @return {User|Null}  The model instance or `null`
     */
    findById(id: number | string): User | null;
    /**
     * Finds a user using the uid field
     *
     * @method findByUid
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
     *
     * @param  {Model}            user
     * @param  {String}            password
     *
     * @return {Boolean}
     */
    validateCredentails(user: Model, password: string): boolean;
    /**
     * Finds a user with token
     *
     * @method findByToken
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
     * @param  {Array|String}     [tokens = null]
     * @param  {Boolean}          [inverse = false]
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
     * @param  {Array|String}     [tokens = null]
     * @param  {Boolean}          [inverse = false]
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
    /**
     * A fake instance of serializer with empty set
     * of array
     *
     * @method fakeResult
     *
     * @return {Object}
     */
    fakeResult(): Object;
}
