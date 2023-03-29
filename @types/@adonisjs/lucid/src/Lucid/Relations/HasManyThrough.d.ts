export = HasManyThrough;
/**
 * BelongsToMany class builds relationship between
 * two models with the help of pivot table/model
 *
 * @class BelongsToMany
 * @constructor
 */
declare class HasManyThrough extends BaseRelation {
    constructor(parentInstance: any, RelatedModel: any, relatedMethod: any, primaryKey: any, foreignKey: any);
    _relatedModelRelation: any;
    _relatedFields: any[];
    _throughFields: any[];
    _fields: any[];
    /**
     * The eagerloadFn is used to make the eagerloading
     * query for a given relationship. The end-user
     * can override this method by passing a
     * custom closure to `eagerLoadQuery`
     * method.
     *
     * @method _eagerLoadFn
     *
     * @param  {Object} query
     * @param  {String} fk
     * @param  {Array} values
     * @param  {String} options.foreignTable
     * @param  {String} options.foreignKey
     *
     * @return {void}
     */
    _eagerLoadFn: (query: Object, fk: string, values: any[], { foreignTable, foreignKey }: string) => void;
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
     * Selects fields with proper table prefixes, also
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
     * Select fields from the primary table
     *
     * @method select
     *
     * @param  {Array} columns
     *
     * @chainable
     */
    select(columns: any[], ...args: any[]): HasManyThrough;
    /**
     * Select fields from the through table.
     *
     * @method selectThrough
     *
     * @param  {Array}      columns
     *
     * @chainable
     */
    selectThrough(columns: any[], ...args: any[]): HasManyThrough;
    /**
     * Select fields from the related table
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
    create(): void;
    save(): void;
    createMany(): void;
    saveMany(): void;
}
import BaseRelation = require("./BaseRelation");
