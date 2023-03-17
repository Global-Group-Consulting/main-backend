export = Database;
/**
 * The database class is a reference to mquery for a single
 * connection. It has couple of extra methods over mquery.
 *
 * Note: You don't instantiate this class directly but instead
 * make use of @ref('DatabaseManager')
 *
 * @class Database
 * @constructor
 * @group Database
 */
declare class Database {
    /**
     * Condition Methods
     *
     * @readonly
     * @static
     * @memberof QueryBuilder
     */
    static readonly get conditionMethods(): string[];
    constructor(config: any);
    connectionString: any;
    databaseName: any;
    connectionOptions: any;
    connection: any;
    db: any;
    _globalTrx: any;
    connect(collectionName: any): Promise<any>;
    getCollection(collectionName: any): Promise<any>;
    collection(collectionName: any): Database;
    collectionName: any;
    /**
     * The schema builder instance to be used
     * for creating database schema.
     *
     * You should obtain a new schema instance for every
     * database operation and should never use stale
     * instances. For example
     *
     * @example
     * ```js
     * // WRONG
     * const schema = Database.schema
     * schema.createCollection('users')
     * schema.createCollection('profiles')
     * ```
     *
     * ```js
     * // RIGHT
     * Database.schema.createCollection('users')
     * Database.schema.createCollection('profiles')
     * ```
     *
     * @attribute schema
     *
     * @return {Object}
     */
    get schema(): Object;
    /**
     * sort
     *
     * @param {any} arg
     * @returns
     * @memberof Database
     */
    sort(...arg: any): Database;
    /**
     * limit
     *
     * @param {any} arg
     * @returns
     * @memberof Database
     */
    limit(...arg: any): Database;
    /**
     * where
     *
     * @param {any} arg
     * @returns
     * @memberof Database
     */
    skip(...arg: any): Database;
    /**
     * select
     *
     * @param {any} arg
     * @returns
     * @memberof Database
     */
    select(...arg: any): Database;
    /**
     * Return a new instance of query builder
     *
     * @method query
     *
     * @return {Object}
     */
    query(): Object;
    queryBuilder: any;
    /**
     * fn
     *
     * @method fn
     *
     * @return {Object}
     */
    get fn(): Object;
    /**
     * get Conditions
     *
     * @readonly
     * @memberof Database
     */
    readonly get conditions(): any;
    /**
     * Clone
     *
     * @memberof Database
     */
    clone(): any;
    /**
     * Closes the database connection. No more queries
     * can be made after this.
     *
     * @method close
     *
     * @return {Promise}
     */
    close(): Promise<any>;
    /**
     * Return a collection
     *
     * @method find
     *
     * @return {Object}
     */
    find(): Object;
    /**
     * Return a document
     *
     * @method findOne
     *
     * @return {Object}
     */
    findOne(): Object;
    /**
     * Return a document
     *
     * @method first
     *
     * @return {Object}
     */
    first(): Object;
    /**
     * Return a document
     *
     * @method pluck
     *
     * @return {Object}
     */
    pluck(field: any): Object;
    /**
     * Update collections
     *
     * @method update
     *
     * @return {Object}
     */
    update(...args: any[]): Object;
    /**
     * Remove collections
     *
     * @method delete
     *
     * @return {Object}
     */
    delete(...args: any[]): Object;
    /**
     * Query pagination
     *
     * @method paginate
     *
     * @return {Object}
     */
    paginate(page: any, limit: any): Object;
    /**
     * Insert document
     *
     * @method insert
     *
     * @return {Object}
     */
    insert(row: any): Object;
    /**
     * @method count
     *
     * @param {any} args
     * @returns {Number|Array}
     * @memberof Database
     */
    count(...args: any): number | any[];
    /**
     * @method count
     *
     * @param {any} args
     * @returns {Number|Array}
     * @memberof Database
     */
    sum(...args: any): number | any[];
    /**
     * @method count
     *
     * @param {any} args
     * @returns {Number|Array}
     * @memberof Database
     */
    avg(...args: any): number | any[];
    /**
     * @method count
     *
     * @param {any} args
     * @returns {Number|Array}
     * @memberof Database
     */
    max(...args: any): number | any[];
    /**
     * @method count
     *
     * @param {any} args
     * @returns {Number|Array}
     * @memberof Database
     */
    min(...args: any): number | any[];
    /**
     * Aggregation
     *
     * @method aggregate
     *
     * @return {Object}
     */
    aggregate(aggregator: any, key: any, groupBy: any): Object;
    /**
     * Query distinct
     *
     * @method distinct
     *
     * @return {Object}
     */
    distinct(...args: any[]): Object;
    /**
     * replace condition methods of mquery
     *
     * @memberof QueryBuilder
     */
    replaceMethods(): void;
    /**
     * Replace where method
     *
     * @returns {this}
     * @memberof QueryBuilder
     */
    where(...args: any[]): this;
}
