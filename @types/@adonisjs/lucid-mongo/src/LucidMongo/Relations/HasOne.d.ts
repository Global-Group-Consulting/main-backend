export = HasOne;
/**
 * The HasOne relationship defines a relation between
 * two models
 *
 * @class HasOne
 * @constructor
 */
declare class HasOne extends BaseRelation {
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
     * Fetch related rows for a relationship
     *
     * @method fetch
     *
     * @alias first
     *
     * @return {Model}
     */
    fetch(): Model;
    /**
     * Fetch related rows for a relationship
     *
     * @method first
     *
     * @return {Model}
     */
    first(): Model;
    /**
     * Adds a where clause to limit the select search
     * to related rows only.
     *
     * @method relatedWhere
     *
     * @param  {Boolean}     count
     *
     * @return {Object}
     */
    relatedWhere(count: boolean): Object;
    /**
     * Adds `on` clause to the innerjoin context. This
     * method is mainly used by HasManyThrough
     *
     * @method addWhereOn
     *
     * @param  {Object}   context
     */
    addWhereOn(context: Object): void;
    /**
     * Saves the related instance to the database. Foreign
     * key is set automatically.
     *
     * NOTE: This method will persist the parent model if
     * not persisted already.
     *
     * @method save
     *
     * @param  {Object} relatedInstance
     *
     * @return {Promise}
     */
    save(relatedInstance: Object): Promise<any>;
    /**
     * Creates the new related instance model and persist
     * it to database. Foreign key is set automatically.
     *
     * NOTE: This method will persist the parent model if
     * not persisted already.
     *
     * @method create
     *
     * @param  {Object} payload
     *
     * @return {Promise}
     */
    create(payload: Object): Promise<any>;
    createMany(): void;
    saveMany(): void;
}
import BaseRelation = require("./BaseRelation");
