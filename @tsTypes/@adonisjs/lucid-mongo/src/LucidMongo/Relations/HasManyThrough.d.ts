export = HasManyThrough;
/**
 * BelongsToMany class builds relationship between
 * two models with the help of pivot collection/model
 *
 * @class BelongsToMany
 * @constructor
 */
declare class HasManyThrough extends BaseRelation {
    constructor(parentInstance: any, RelatedModel: any, relatedMethod: any, primaryKey: any, foreignKey: any);
    relatedMethod: any;
    _relatedModelRelation: any;
    throughQuery: any;
    _relatedFields: any[];
    _throughFields: any[];
    _fields: any[];
    /**
     * The join query to target the right set of
     * rows
     *
     * @method _makeJoinQuery
     *
     * @return {void}
     *
     * @private
     */
    private _makeJoinQuery;
    /**
     * Selects fields with proper collection prefixes, also
     * all through model fields are set for sideloading,
     * so that model properties are not polluted.
     *
     * @method _selectFields
     *
     * @return {void}
     *
     * @private
     */
    private _selectFields;
    /**
     * Select fields from the primary collection
     *
     * @method select
     *
     * @param  {Array} columns
     *
     * @chainable
     */
    select(columns: any[], ...args: any[]): HasManyThrough;
    /**
     * Select fields from the through collection.
     *
     * @method selectThrough
     *
     * @param  {Array}      columns
     *
     * @chainable
     */
    selectThrough(columns: any[], ...args: any[]): HasManyThrough;
    /**
     * Select fields from the through collection.
     *
     * @method whereThrough
     *
     * @param  {Array}      args
     *
     * @chainable
     */
    whereThrough(...args: any[]): HasManyThrough;
    /**
     * Select fields from the through collection.
     *
     * @method whereThrough
     *
     * @param  {Array}      args
     *
     * @chainable
     */
    whereInThrough(...args: any[]): HasManyThrough;
    /**
     * Select fields from the related collection
     *
     * @method selectRelated
     *
     * @param  {Array}      columns
     *
     * @chainable
     */
    selectRelated(columns: any[], ...args: any[]): HasManyThrough;
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
     * Adds `on` clause to the innerjoin context. This
     * method is mainly used by HasManyThrough
     *
     * @method addWhereOn
     *
     * @param  {Object}   context
     */
    relatedWhere(count: any): any;
    /**
     * Fetch over the related rows
     *
     * @return {Serializer}
     */
    fetch(): Serializer;
    /**
     * Fetch over the related rows
     *
     * @return {Object}
     */
    first(): Object;
    /**
     * @method count
     *
     * @return {Object|Number}
     */
    count(...args: any[]): Object | number;
    /**
     * @method update
     *
     * @return {Object|Number}
     */
    update(...args: any[]): Object | number;
    /**
     * @method delete
     *
     * @return {Object|Number}
     */
    delete(...args: any[]): Object | number;
    create(): void;
    save(): void;
    createMany(): void;
    saveMany(): void;
}
import BaseRelation = require("./BaseRelation");
