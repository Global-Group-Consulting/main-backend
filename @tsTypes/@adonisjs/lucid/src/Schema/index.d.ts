export = Schema;
/**
 * The schema is used to define SQL table schemas. This makes
 * use of all the methods from http://knexjs.org/#Schema
 *
 * @binding Adonis/Src/Schema
 * @alias Schema
 * @group Database
 * @uses (['Adonis/Src/Database'])
 *
 * @class Schema
 * @constructor
 */
declare class Schema {
    /**
     * Connection to be used for schema
     *
     * @attribute connection
     *
     * @return {String}
     */
    static get connection(): string;
    constructor(Database: any);
    db: any;
    _chains: any[];
    /**
     * The schema instance of knex
     *
     * @attribute schema
     *
     * @return {Object}
     */
    get schema(): Object;
    /**
     * Access to db fn
     *
     * @attribute fn
     *
     * @return {Object}
     */
    get fn(): Object;
    /**
     * Returns a boolean indicating if a table
     * already exists or not
     *
     * @method hasTable
     *
     * @param  {String}  tableName
     *
     * @return {Boolean}
     */
    hasTable(tableName: string): boolean;
    /**
     * Returns a boolean indicating if a column exists
     * inside a table or not.
     *
     * @method hasColumn
     *
     * @param  {String}  tableName
     * @param  {String}  columnName
     *
     * @return {Boolean}
     */
    hasColumn(tableName: string, columnName: string): boolean;
    /**
     * Execute deferred actions in sequence. All the actions will be
     * wrapped inside a transaction, which get's rolled back on
     * error.
     *
     * @method executeActions
     *
     * @param {Boolean} [getSql = false] Get sql for the actions over executing them
     *
     * @return {Array}
     */
    executeActions(getSql?: boolean | undefined): any[];
}
