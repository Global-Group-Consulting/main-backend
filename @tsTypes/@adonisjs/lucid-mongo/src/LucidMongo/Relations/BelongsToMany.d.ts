export = BelongsToMany;
/**
 * BelongsToMany class builds relationship between
 * two models with the help of pivot collection/model
 *
 * @class BelongsToMany
 * @constructor
 */
declare class BelongsToMany extends BaseRelation {
    constructor(parentInstance: any, relatedModel: any, primaryKey: any, foreignKey: any, relatedPrimaryKey: any, relatedForeignKey: any);
    relatedForeignKey: any;
    relatedPrimaryKey: any;
    /**
     * Since user can define a fully qualified model for
     * pivot collection, we store it under this variable.
     *
     * @type {[type]}
     */
    _PivotModel: [type];
    /**
     * Settings related to pivot collection only
     *
     * @type {Object}
     */
    _pivot: Object;
    _relatedFields: any[];
    /**
     * Here we store the existing pivot rows, to make
     * sure we are not inserting duplicates.
     *
     * @type {Array}
     */
    _existingPivotInstances: any[];
    /**
     * Returns the pivot collection name. The pivot model is
     * given preference over the default collection name.
     *
     * @attribute $pivotCollection
     *
     * @return {String}
     */
    get $pivotCollection(): string;
    /**
     * The pivot columns to be selected
     *
     * @attribute $pivotColumns
     *
     * @return {Array}
     */
    get $pivotColumns(): any[];
    /**
     * Returns the name of select statement on pivot collection
     *
     * @method _selectForPivot
     *
     * @param  {String}        field
     *
     * @return {String}
     *
     * @private
     */
    private _selectForPivot;
    /**
     * Adds a where clause on pivot collection by prefixing
     * the pivot collection name.
     *
     * @method _whereForPivot
     *
     * @param  {String}       operator
     * @param  {String}       key
     * @param  {...Spread}    args
     *
     * @return {void}
     *
     * @private
     */
    private _whereForPivot;
    /**
     * Newup the pivot model set by user or the default
     * pivot model
     *
     * @method _newUpPivotModel
     *
     * @return {Object}
     *
     * @private
     */
    private _newUpPivotModel;
    /**
     * The pivot collection values are sideloaded, so we need to remove
     * them sideload and instead set it as a relationship on
     * model instance
     *
     * @method _addPivotValuesAsRelation
     *
     * @param  {Object}                  row
     *
     * @private
     */
    private _addPivotValuesAsRelation;
    /**
     * Saves the relationship to the pivot collection
     *
     * @method _attachSingle
     * @async
     *
     * @param  {Number|String}      value
     * @param  {Function}           [pivotCallback]
     *
     * @return {Object}                    Instance of pivot model
     *
     * @private
     */
    private _attachSingle;
    /**
     * Persists the parent model instance if it's not
     * persisted already. This is done before saving
     * the related instance
     *
     * @method _persistParentIfRequired
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _persistParentIfRequired;
    /**
     * Loads the pivot relationship and then caches
     * it inside memory, so that more calls to
     * this function are not hitting database.
     *
     * @method _loadAndCachePivot
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _loadAndCachePivot;
    /**
     * Returns the existing pivot instance for a given
     * value.
     *
     * @method _getPivotInstance
     *
     * @param  {String|Number}          value
     *
     * @return {Object|Null}
     *
     * @private
     */
    private _getPivotInstance;
    /**
     * Define a fully qualified model to be used for
     * making pivot collection queries and using defining
     * pivot collection settings.
     *
     * @method pivotModel
     *
     * @param  {Model}   pivotModel
     *
     * @chainable
     */
    pivotModel(pivotModel: Model): BelongsToMany;
    /**
     * Define the pivot collection
     *
     * @method pivotCollection
     *
     * @param  {String}   collection
     *
     * @chainable
     */
    pivotCollection(collection: string): BelongsToMany;
    /**
     * Make sure `created_at` and `updated_at` timestamps
     * are being used
     *
     * @method withTimestamps
     *
     * @chainable
     */
    withTimestamps(): BelongsToMany;
    /**
     * Fields to be selected from pivot collection
     *
     * @method withPivot
     *
     * @param  {Array}  fields
     *
     * @chainable
     */
    withPivot(fields: any[]): BelongsToMany;
    /**
     * Make a where clause on the pivot collection
     *
     * @method whereInPivot
     *
     * @param  {String}     key
     * @param  {...Spread}  args
     *
     * @chainable
     */
    whereInPivot(key: string, ...args: Spread[]): BelongsToMany;
    /**
     * Make a orWhere clause on the pivot collection
     *
     * @method orWherePivot
     *
     * @param  {String}     key
     * @param  {...Spread}  args
     *
     * @chainable
     */
    orWherePivot(key: string, ...args: Spread[]): BelongsToMany;
    /**
     * Where clause on pivot collection
     *
     * @method wherePivot
     *
     * @param  {String}    key
     * @param  {...Spread} args
     *
     * @chainable
     */
    wherePivot(key: string, ...args: Spread[]): BelongsToMany;
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
     * Groups related instances with their foriegn keys
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
     * Fetch over the related rows
     *
     * @return {Serializer}
     */
    fetch(): Serializer;
    /**
     * First related rows
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
     * @method max
     *
     * @return {Object|Number}
     */
    max(...args: any[]): Object | number;
    /**
     * @method min
     *
     * @return {Object|Number}
     */
    min(...args: any[]): Object | number;
    /**
     * @method sum
     *
     * @return {Object|Number}
     */
    sum(...args: any[]): Object | number;
    /**
     * @method avg
     *
     * @return {Object|Number}
     */
    avg(...args: any[]): Object | number;
    /**
     * Returns the query for pivot collection
     *
     * @method pivotQuery
     *
     * @param {Boolean} selectFields
     *
     * @return {Object}
     */
    pivotQuery(selectFields?: boolean): Object;
    _pivotQuery: any;
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
    addWhereOn(context: any): void;
    /**
     * Attach existing rows inside pivot collection as a relationship
     *
     * @method attach
     *
     * @param  {Number|String|Array} relatedPrimaryKeyValue
     * @param  {Function} [pivotCallback]
     *
     * @return {Promise}
     */
    attach(references: any, pivotCallback?: Function | undefined): Promise<any>;
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
     * Update related rows
     *
     * @method update
     *
     * @param  {Object} values
     *
     * @return {Number}        Number of effected rows
     */
    update(values: Object): number;
    /**
     * Detach existing relations from the pivot collection
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
     * Calls `detach` and `attach` together.
     *
     * @method sync
     *
     * @param  {Number|String|Array} relatedPrimaryKeyValue
     * @param  {Function} [pivotCallback]
     *
     * @return {void}
     */
    sync(references: any, pivotCallback?: Function | undefined): void;
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
    save(relatedInstance: Object, pivotCallback: Function): void;
    /**
     * Save multiple relationships to the database. This method
     * will run queries in parallel
     *
     * @method saveMany
     * @async
     *
     * @param  {Array}    arrayOfRelatedInstances
     * @param  {Function} [pivotCallback]
     *
     * @return {void}
     */
    saveMany(arrayOfRelatedInstances: any[], pivotCallback?: Function | undefined): void;
    /**
     * Creates a new related model instance and persist
     * the relationship inside pivot collection
     *
     * @method create
     * @async
     *
     * @param  {Object}   row
     * @param  {Function} [pivotCallback]
     *
     * @return {Object}               Instance of related model
     */
    create(row: Object, pivotCallback?: Function | undefined): Object;
    /**
     * Creates multiple related relationships. This method will
     * call all queries in parallel
     *
     * @method createMany
     * @async
     *
     * @param  {Array}   rows
     * @param  {Function}   pivotCallback
     *
     * @return {Array}
     */
    createMany(rows: any[], pivotCallback: Function): any[];
}
import BaseRelation = require("./BaseRelation");
