export = QueryBuilder;
/**
 * Query builder for the lucid models extended
 * by the @ref('Database') class.
 *
 * @class QueryBuilder
 * @constructor
 */
declare class QueryBuilder {
    /**
     * Returns count of a relationship
     *
     * @method withCount
     *
     * @param  {String}   relation
     * @param  {Function} callback
     *
     * @chainable
     *
     * @example
     * ```js
     * query().withCount('profile')
     * query().withCount('profile as userProfile')
     * ```
     */
    /**
     * Condition Methods
     *
     * @readonly
     * @static
     * @memberof QueryBuilder
     */
    static readonly get conditionMethods(): string[];
    constructor(Model: any, connection: any);
    Model: any;
    collection: any;
    /**
     * Reference to database provider
     */
    db: any;
    /**
     * mquery
     */
    query: any;
    /**
     * Scopes to be ignored at runtime
     *
     * @type {Array}
     *
     * @private
     */
    private _ignoreScopes;
    /**
     * Relations to be eagerloaded
     *
     * @type {Object}
     */
    _eagerLoads: Object;
    /**
     * The sideloaded data for this query
     *
     * @type {Array}
     */
    _sideLoaded: any[];
    /**
     * Query level visible fields
     *
     * @type {Array}
     */
    _visibleFields: any[];
    /**
     * Query level hidden fields
     *
     * @type {Array}
     */
    _hiddenFields: any[];
    /**
     * @method getCollection
     *
     * @returns MongodbCollection
     * @memberof QueryBuilder
     */
    getCollection(): Promise<any>;
    /**
     *
     * @method query
     *
     * @return {Object}
     */
    on(event: any, callback: any): Object;
    /**
     * This method will apply all the global query scopes
     * to the query builder
     *
     * @method applyScopes
     *
     * @private
     */
    private _applyScopes;
    /**
     * Maps all rows to model instances
     *
     * @method _mapRowsToInstances
     *
     * @param  {Array}            rows
     *
     * @return {Array}
     *
     * @private
     */
    private _mapRowsToInstances;
    /**
     * Maps a single row to model instance
     *
     * @method _mapRowToInstance
     *
     * @param  {Object}          row
     *
     * @return {Model}
     */
    _mapRowToInstance(row: Object): Model;
    /**
     * Eagerload relations for all model instances
     *
     * @method _eagerLoad
     *
     * @param  {Array}   modelInstance
     *
     * @return {void}
     *
     * @private
     */
    private _eagerLoad;
    /**
     * Instruct query builder to ignore all global
     * scopes.
     *
     * Passing `*` will ignore all scopes or you can
     * pass an array of scope names.
     *
     * @param {Array} [scopes = ['*']]
     *
     * @method ignoreScopes
     *
     * @chainable
     */
    ignoreScopes(scopes?: any[] | undefined): QueryBuilder;
    /**
     * Execute the query builder chain by applying global scopes
     *
     * @method fetch
     * @async
     *
     * @return {Serializer} Instance of model serializer
     */
    fetch(): any;
    /**
     * Returns the first row from the database.
     *
     * @method first
     * @async
     *
     * @return {Model|Null}
     */
    first(): Model | null;
    /**
     * Throws an exception when unable to find the first
     * row for the built query
     *
     * @method firstOrFail
     * @async
     *
     * @return {Model}
     *
     * @throws {ModelNotFoundException} If unable to find first row
     */
    firstOrFail(): Model;
    /**
     * Find record by primary key
     *
     * @method find
     * @async
     *
     * @param  {string} id
     *
     * @return {Model|null}
     */
    find(id: string): Model | null;
    /**
     * Paginate records, same as fetch but returns a
     * collection with pagination info
     *
     * @method paginate
     * @async
     *
     * @param  {Number} [page = 1]
     * @param  {Number} [limit = 20]
     *
     * @return {Serializer}
     */
    paginate(page?: number | undefined, limit?: number | undefined): any;
    /**
     * Bulk update data from query builder. This method will also
     * format all dates and set `updated_at` column
     *
     * @method update
     * @async
     *
     * @param  {Object} values
     *
     * @return {Promise}
     */
    update(values: Object): Promise<any>;
    /**
     * Deletes the rows from the database.
     *
     * @method delete
     * @async
     *
     * @return {Promise}
     */
    delete(): Promise<any>;
    /**
     * Insert row.
     *
     * @method insert
     *
     * @param {object} attributes
     * @returns {Promise}
     */
    insert(attributes: object): Promise<any>;
    /**
     * Returns an array of primaryKeys
     *
     * @method ids
     * @async
     *
     * @return {Array}
     */
    ids(): any[];
    /**
   * Returns an array of selected field
   *
   * @method pluck
   * @param {String} field
   * @async
   *
   * @return {Array}
   */
    pluck(field: string): any[];
    /**
     * Returns a pair of lhs and rhs. This method will not
     * eagerload relationships.
     *
     * @method pair
     * @async
     *
     * @param  {String} lhs
     * @param  {String} rhs
     *
     * @return {Object}
     */
    pair(lhs: string, rhs: string): Object;
    /**
     * Same as `pick` but inverse
     *
     * @method pickInverse
     * @async
     *
     * @param  {Number}    [limit = 1]
     *
     * @return {Collection}
     */
    pickInverse(limit?: number | undefined): Collection;
    /**
     * Pick x number of rows from the database
     *
     * @method pick
     * @async
     *
     * @param  {Number} [limit = 1]
     *
     * @return {Collection}
     */
    pick(limit?: number | undefined): Collection;
    /**
     * Eagerload relationships when fetching the parent
     * record
     *
     * @method with
     *
     * @param  {String}   relation
     * @param  {Function} [callback]
     *
     * @chainable
     */
    with(...args: any[]): QueryBuilder;
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
    /**
     * Where field is not exists
     *
     * @param {String} key
     * @param {Mixed} [value]
     *
     * @chainable
     */
    whereNull(key: string): QueryBuilder;
    /**
     * Where field is exists
     *
     * @param {String} key
     * @param {Mixed} [value]
     *
     * @chainable
     */
    whereNotNull(key: string): QueryBuilder;
    /**
     * Where field in array
     *
     * @param {String} key
     * @param {Mixed} [value]
     *
     * @chainable
     */
    whereIn(key: string, values: any): QueryBuilder;
    /**
     * Where field not in array
     *
     * @param {String} key
     * @param {Mixed} [value]
     *
     * @chainable
     */
    whereNotIn(key: string, values: any): QueryBuilder;
    /**
     * Convert select query
     *
     * @public
     */
    public select(...args: any[]): QueryBuilder;
    /**
     * @method orderBy
     *
     * @returns {this}
     * @memberof QueryBuilder
     */
    orderBy(...args: any[]): this;
    /**
     * Count collections
     *
     * @method count
     *
     * @return {Object}
     */
    count(groupBy: any): Object;
    /**
     * Max field collections
     *
     * @method max
     *
     * @return {Object}
     */
    max(key: any, groupBy: any): Object;
    /**
     * Min field collections
     *
     * @method min
     *
     * @return {Object}
     */
    min(key: any, groupBy: any): Object;
    /**
     * Sum field collections
     *
     * @method sum
     *
     * @return {Object}
     */
    sum(key: any, groupBy: any): Object;
    /**
     * Average field collections
     *
     * @method avg
     *
     * @return {Object}
     */
    avg(key: any, groupBy: any): Object;
    /**
     * Aggregation
     *
     * @method _aggregate
     *
     * @return {Object}
     */
    _aggregate(aggregator: any, key: any, groupBy: any): Object;
    aggregate(...args: any[]): Promise<any>;
    /**
     * Distinct field collections
     *
     * @method distinct
     *
     * @return {Object}
     */
    distinct(field: any, ...args: any[]): Object;
    /**
     * Returns the sql representation of query
     *
     * @method toSQL
     *
     * @return {Object}
     */
    toSQL(): Object;
    /**
     * Returns string representation of query
     *
     * @method toString
     *
     * @return {String}
     */
    toString(): string;
    /**
     * Define fields to be visible for a single
     * query.
     *
     * Computed when `toJSON` is called
     *
     * @method setVisible
     *
     * @param  {Array}   fields
     *
     * @chainable
     */
    setVisible(fields: any[]): QueryBuilder;
    /**
     * Define fields to be hidden for a single
     * query.
     *
     * Computed when `toJSON` is called
     *
     * @method setHidden
     *
     * @param  {Array}   fields
     *
     * @chainable
     */
    setHidden(fields: any[]): QueryBuilder;
}
