export = PivotModel;
/**
 * Pivot model is used when a pivot relationship
 * instance is created. If user defines a custom
 * `pivotModel` then this model is not used.
 *
 * This model is not compatable with the actual Lucid
 * model, but is somehow similar.
 *
 * @class PivotModel
 * @constructor
 */
declare class PivotModel extends BaseModel {
    $withTimestamps: boolean | undefined;
    $primaryKey: string | undefined;
    /**
     * Perform required actions to newUp the model instance. This
     * method does not call setters since it is supposed to be
     * called after `fetch` or `find`.
     *
     * @method newUp
     *
     * @param  {Object} row
     *
     * @return {void}
     */
    newUp(row: Object): void;
    /**
     * Converts model to an object. This method will cast dates.
     *
     * @method toObject
     *
     * @return {Object}
     */
    toObject(): Object;
    /**
     * Set attribute on model instance. Setting properties
     * manually or calling the `set` function has no
     * difference.
     *
     * Note this method will call the setter
     *
     * @method set
     *
     * @param  {String} name
     * @param  {Mixed} value
     *
     * @return {void}
     */
    set(name: string, value: Mixed): void;
    /**
     * Returns query builder instance for a given connection
     * and table
     *
     * @method query
     *
     * @param  {String} table
     * @param  {Object} connection
     *
     * @return {Object}
     */
    query(table: string, connection: Object): Object;
    /**
     * Save the model instance to the database.
     *
     * @method save
     * @async
     *
     * @param {Object} trx
     *
     * @return {void}
     */
    save(trx: Object): void;
    primaryKeyValue: any;
}
import BaseModel = require("./Base");
