export = Schema;
/**
 * The schema is used to define SQL collection schemas. This makes
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
    _deferredActions: any[];
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
     * Create a new collection.
     *
     * NOTE: This action is deferred
     *
     * @method createCollection
     *
     * @param  {String}    collectionName
     * @param  {Function}  callback
     *
     * @chainable
     */
    createCollection(collectionName: string, callback: Function): Schema;
    /**
     * Create a new collection if not already exists.
     *
     * NOTE: This action is deferred
     *
     * @method createCollectionIfNotExists
     *
     * @param  {String}    collectionName
     * @param  {Function}  callback
     *
     * @chainable
     */
    createCollectionIfNotExists(collectionName: string, callback: Function): Schema;
    /**
     * Rename existing collection.
     *
     * NOTE: This action is deferred
     *
     * @method renameCollection
     *
     * @param  {String}    fromCollection
     * @param  {String}    toCollection
     *
     * @chainable
     */
    renameCollection(fromCollection: string, toCollection: string): Schema;
    /**
     * Drop existing collection.
     *
     * NOTE: This action is deferred
     *
     * @method dropCollection
     *
     * @param  {String}    collectionName
     *
     * @chainable
     */
    dropCollection(collectionName: string): Schema;
    /**
     * Drop collection only if it exists.
     *
     * NOTE: This action is deferred
     *
     * @method dropCollectionIfExists
     *
     * @param  {String}    collectionName
     *
     * @chainable
     */
    dropCollectionIfExists(collectionName: string): Schema;
    /**
     * Select collection for altering it.
     *
     * NOTE: This action is deferred
     *
     * @method collection
     *
     * @param  {String}    collectionName
     * @param  {Function}  callback
     *
     * @chainable
     */
    collection(collectionName: string, callback: Function): Schema;
    /**
     * Run a raw SQL statement
     *
     * @method raw
     *
     * @param  {String} statement
     *
     * @return {Object}
     */
    raw(statement: string): Object;
    /**
     * Returns a boolean indicating if a collection
     * already exists or not
     *
     * @method hasCollection
     *
     * @param  {String}  collectionName
     *
     * @return {Boolean}
     */
    hasCollection(collectionName: string): boolean;
    /**
     * Returns a boolean indicating if a column exists
     * inside a collection or not.
     *
     * @method hasColumn
     *
     * @param  {String}  collectionName
     * @param  {String}  columnName
     *
     * @return {Boolean}
     */
    hasColumn(collectionName: string, columnName: string): boolean;
    /**
     * Alias for @ref('Schema.collection')
     *
     * @method alter
     */
    alter(...args: any[]): Schema;
    /**
     * Alias for @ref('Schema.createCollection')
     *
     * @method create
     */
    create(...args: any[]): Schema;
    /**
     * Alias for @ref('Schema.dropCollection')
     *
     * @method drop
     */
    drop(...args: any[]): Schema;
    /**
     * Alias for @ref('Schema.dropCollectionIfExists')
     *
     * @method dropIfExists
     */
    dropIfExists(...args: any[]): Schema;
    /**
     * Alias for @ref('Schema.renameCollection')
     *
     * @method rename
     */
    rename(...args: any[]): Schema;
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
