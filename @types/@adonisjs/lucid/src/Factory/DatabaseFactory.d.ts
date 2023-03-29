export = DatabaseFactory;
/**
 * Model factory to seed database using Lucid
 * models
 *
 * @class DatabaseFactory
 * @constructor
 */
declare class DatabaseFactory {
    constructor(tableName: any, dataCallback: any);
    tableName: any;
    dataCallback: any;
    _returningColumn: string | null;
    _connection: string | null;
    /**
     * Returns the query builder instance for
     * a given connection
     *
     * @method _getQueryBuilder
     *
     * @return {Object}
     *
     * @private
     */
    private _getQueryBuilder;
    /**
     * Make a single instance of blueprint for a given
     * index. This method will evaluate the functions
     * in the return payload from blueprint.
     *
     * @method _makeOne
     * @async
     *
     * @param  {Number} index
     * @param  {Object} data
     *
     * @return {Object}
     *
     * @private
     */
    private _makeOne;
    /**
     * Set table to used for the database
     * operations
     *
     * @method table
     *
     * @param  {String} tableName
     *
     * @chainable
     */
    table(tableName: string): DatabaseFactory;
    /**
     * Specify the returning column from the insert
     * query
     *
     * @method returning
     *
     * @param  {String}  column
     *
     * @chainable
     */
    returning(column: string): DatabaseFactory;
    /**
     * Specify the connection to be used on
     * the query builder
     *
     * @method connection
     *
     * @param  {String}   connection
     *
     * @chainable
     */
    connection(connection: string): DatabaseFactory;
    /**
     * Make a single model instance with attributes
     * from blueprint fake values
     *
     * @method make
     * @async
     *
     * @param  {Object} data
     * @param  {Number} [index = 0]
     *
     * @return {Object}
     */
    make(data?: Object, index?: number | undefined): Object;
    /**
     * Make x number of model instances with
     * fake data
     *
     * @method makeMany
     * @async
     *
     * @param  {Number} instances
     * @param  {Object} [data = {}]
     *
     * @return {Array}
     */
    makeMany(instances: number, data?: Object | undefined): any[];
    /**
     * Create model instance and persist to database
     * and then return it back
     *
     * @method create
     * @async
     *
     * @param  {Object} data
     *
     * @return {Object}
     */
    create(data?: Object, index?: number): Object;
    /**
     * Persist multiple model instances to database and get
     * them back as an array
     *
     * @method createMany
     * @async
     *
     * @param  {Number}   numberOfRows
     * @param  {Object}   [data = {}]
     *
     * @return {Array}
     */
    createMany(numberOfRows: number, data?: Object | undefined): any[];
    /**
     * Truncate the database table
     *
     * @method reset
     * @async
     *
     * @return {Number}
     */
    reset(): number;
}
