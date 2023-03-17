export = BelongsTo;

/**
 * The BelongsTo relationship defines a relation between
 * two models
 *
 * @class BelongsTo
 * @constructor
 */
declare class BelongsTo extends BaseRelation {
    /**
     * Map values from model instances to an array. It is required
     * to make `whereIn` query when eagerloading results.
     *
     * @method mapValues
     *
     * @param  {Array}  modelInstances
     *
     * @return {Array}
     */
    mapValues (modelInstances: any[]): any[];
    
    /**
     * Groups related instances with their foriegn keys
     *
     * @method group
     *
     * @param  {Array} relatedInstances
     *
     * @return {Object} @multiple([key=String, values=Array, defaultValue=Null])
     */
    group (relatedInstances: any[]): Object;
    
    /**
     * Returns the first row for the related model
     *
     * @method first
     *
     * @return {Object|Null}
     */
    first (): Object | null;
    
    /**
     * Overriding fetch to call first, since belongsTo
     * can never have many rows
     *
     * @method fetch
     * @async
     *
     * @return {Object}
     */
    fetch (): Object;
    
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
    relatedWhere (count: boolean): Object;
    
    /**
     * Adds `on` clause to the innerjoin context. This
     * method is mainly used by HasManyThrough
     *
     * @method addWhereOn
     *
     * @param  {Object}   context
     */
    addWhereOn (context: Object): void;
    
    create (): void;
    
    save (): void;
    
    createMany (): void;
    
    saveMany (): void;
    
    /**
     * Associate 2 models together, also this method will save
     * the related model if not already persisted
     *
     * @method associate
     * @async
     *
     * @param  {Object}  relatedInstance
     *
     * @return {Promise}
     */
    associate (relatedInstance: Object): Promise<any>;
    
    /**
     * Dissociate relationship from database by setting `foriegnKey` to null
     *
     * @method dissociate
     * @async
     *
     * @return {Promise}
     */
    dissociate (): Promise<any>;
    
    select (strings: string[]): BelongsTo
}

import BaseRelation = require('./BaseRelation')
