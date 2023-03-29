export = Migration;
/**
 * Migration class is used to migrate the database by
 * calling actions defined inside schema class.
 *
 * @binding Adonis/Src/Migration
 * @singleton
 * @alias Migration
 * @group Database
 * @uses (['Adonis/Src/Config', 'Adonis/Src/Database'])
 *
 * @class Migration
 * @constructor
 */
declare class Migration {
    constructor(Config: any, Database: any);
    db: any;
    _migrationsCollection: any;
    _lockCollection: string;
    /**
     * Makes the migrations collection only if doesn't exists
     *
     * @method _makeMigrationsCollection
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _makeMigrationsCollection;
    /**
     * Creates the lock collection if it doesn't exists
     *
     * @method _makeLockCollection
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _makeLockCollection;
    /**
     * Adds lock to make sure only one migration
     * process runs at a time
     *
     * @method _addLock
     * @async
     *
     * @private
     */
    private _addLock;
    /**
     * Remove the added lock
     *
     * @method _removeLock
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _removeLock;
    /**
     * Checks for lock and throws exception if
     * lock exists
     *
     * @method _checkForLock
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _checkForLock;
    /**
     * Returns the latest batch number. Any inserts
     * should be done by incrementing the batch
     * number
     *
     * @method _getLatestBatch
     * @async
     *
     * @return {Number}
     *
     * @private
     */
    private _getLatestBatch;
    /**
     * Add a new row to the migrations collection for
     * a given batch
     *
     * @method _addForBatch
     * @async
     *
     * @param  {String}     name
     * @param  {Number}     batch
     *
     * @return {void}
     *
     * @private
     */
    private _addForBatch;
    /**
     * Remove row for a given schema defination from
     * the migrations collection
     *
     * @method _remove
     * @async
     *
     * @param  {String} name
     *
     * @return {void}
     *
     * @private
     */
    private _remove;
    /**
     * Get all the schema definations after a batch
     * number.
     *
     * Note: This method will return all the rows when
     * batch is defined as zero
     *
     * @method _getAfterBatch
     * @async
     *
     * @param  {Number}       [batch = 0]
     *
     * @return {Array}
     *
     * @private
     */
    private _getAfterBatch;
    /**
     * Returns an array of schema names to be executed for
     * a given action.
     *
     * @method _getDiff
     *
     * @param  {Array}  names - Name of all schemas
     * @param  {String} direction - The direction for the migration
     * @param  {String} [batch]
     *
     * @return {Array}
     *
     * @private
     */
    private _getDiff;
    /**
     * Executes a single schema file
     *
     * @method _executeSchema
     *
     * @param  {Object}       schemaInstance
     * @param  {String}       direction
     * @param  {Boolean}      [toSQL]
     * @param  {String}       [name] Required when toSQL is set to true
     *
     * @return {Object|void}   The queries array is returned when toSQL is set to true
     *
     * @private
     */
    private _executeSchema;
    /**
     * Execute all schemas one by one in sequence
     *
     * @method _execute
     * @async
     *
     * @param  {Object} Schemas
     * @param  {String} direction
     *
     * @return {void}
     *
     * @private
     */
    private _execute;
    /**
     * Return an array of queries strings
     *
     * @method _getQueries
     * @async
     *
     * @param  {Object}    schemas
     * @param  {String}    direction
     *
     * @return {Array}
     *
     * @private
     */
    private _getQueries;
    /**
     * Clean up state by removing lock and
     * close the db connection
     *
     * @method _cleanup
     *
     * @return {void}
     */
    _cleanup(): void;
    /**
     * Migrate the database using defined schema
     *
     * @method up
     *
     * @param  {Object} schemas
     *
     * @return {Object}
     *
     * @throws {Error} If any of schema file throws exception
     */
    up(schemas: Object, toSQL: any): Object;
    /**
     * Rollback migrations to a given batch, latest
     * batch or the way upto to first batch.
     *
     * @method down
     *
     * @param  {Object} schemas
     * @param  {Number} batch
     * @param  {Boolean} toSQL
     *
     * @return {Object}
     *
     * @throws {Error} If something blows in schema file
     */
    down(schemas: Object, batch: number, toSQL?: boolean): Object;
    /**
     * Returns the status of all the schemas
     *
     * @method status
     *
     * @param  {Object} schemas
     *
     * @return {Object}
     */
    status(schemas: Object): Object;
}
