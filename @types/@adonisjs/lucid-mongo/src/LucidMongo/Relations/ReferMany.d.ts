export = ReferMany;
/**
 * ReferMany class builds relationship between
 * two models with the help of pivot collection/model
 *
 * @class ReferMany
 * @constructor
 */
declare class ReferMany extends BaseRelation {
    /**
       * Persists the parent model instance if it's not
       * persisted already. This is done before saving
       * the related instance
       *
       * @method _persistParentIfRequired
       *
       * @return {void}
       *
       * @private
       */
    private _persistParentIfRequired;
    /**
     * Returns an array of values to be used for running
     * whereIn query when eagerloading relationships.
     *
     * @method mapValues
     *
     * @param  {Array}  modelInstances - An array of model instances
     *
     * @return {Array}
     */
    mapValues(modelInstances: any[]): any[];
    /**
     * Takes an array of related instances and returns an array
     * for each parent record.
     *
     * @method group
     *
     * @param  {Array} relatedInstances
     *
     * @return {Object} @multiple([key=String, values=Array, defaultValue=Null])
     */
    group(relatedInstances: any[]): Object;
    /**
     * Method called when eagerloading for a single
     * instance
     *
     * @method load
     * @async
     *
     * @return {Promise}
     */
    load(): Promise<any>;
    /**
     * Attach existing rows
     *
     * @method attach
     *
     * @param  {Number|String|Array} relatedPrimaryKeyValue
     *
     * @return {Promise}
     */
    attach(references: any): Promise<any>;
    /**
     * Delete related model rows in bulk and also detach
     * them from the pivot collection.
     *
     * NOTE: This method will run 3 queries in total. First is to
     * fetch the related rows, next is to delete them and final
     * is to remove the relationship from pivot collection.
     *
     * @method delete
     * @async
     *
     * @return {Number} Number of effected rows
     */
    delete(): number;
    /**
     * Detach existing relations from relates
     *
     * @method detach
     * @async
     *
     * @param  {Array} references
     *
     * @return {Number}  The number of effected rows
     */
    detach(references: any[]): number;
    /**
     * Save the related model instance and setup the relationship
     * inside pivot collection
     *
     * @method save
     *
     * @param  {Object} relatedInstance
     * @param  {Function} pivotCallback
     *
     * @return {void}
     */
    save(relatedInstance: Object): void;
    /**
     * Save multiple relationships to the database. This method
     * will run queries in parallel
     *
     * @method saveMany
     * @async
     *
     * @param  {Array}    arrayOfRelatedInstances
     *
     * @return {void}
     */
    saveMany(arrayOfRelatedInstances: any[]): void;
    /**
     * Creates a new related model instance and persist
     * the relationship inside pivot collection
     *
     * @method create
     * @async
     *
     * @param  {Object}   row
     *
     * @return {Object}               Instance of related model
     */
    create(row: Object): Object;
    /**
     * Creates multiple related relationships. This method will
     * call all queries in parallel
     *
     * @method createMany
     * @async
     *
     * @param  {Array}   rows
     *
     * @return {Array}
     */
    createMany(rows: any[]): any[];
}
import BaseRelation = require("./BaseRelation");
