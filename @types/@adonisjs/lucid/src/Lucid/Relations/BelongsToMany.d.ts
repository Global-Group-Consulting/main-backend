export = BelongsToMany;
/**
 * BelongsToMany class builds relationship between
 * two models with the help of pivot table/model
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
     * pivot table, we store it under this variable.
     *
     * @type {[type]}
     */
    _PivotModel: [type];
    scopesIterator: any;
    /**
     * Settings related to pivot table only
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
     * @param  {Array}  values
     *
     * @return {void}
     */
    _eagerLoadFn: (query: Object, fk: string, values: any[]) => void;
    /**
     * Returns reference to pivot model (if attached) otherwise
     * returns `null`.
     *
     * @attribute $pivotModel
     *
     * @return {Model|null}
     */
    get $pivotModel(): any;
    /**
     * Returns the pivot table name. The pivot model is
     * given preference over the default table name.
     *
     * @attribute $pivotTable
     *
     * @return {String}
     */
    get $pivotTable(): string;
    /**
     * The pivot columns to be selected
     *
     * @attribute $pivotColumns
     *
     * @return {Array}
     */
    get $pivotColumns(): any[];
    /**
     * Returns the name of select statement on pivot table
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
     * Applies global scopes when pivot model is defined
     *
     * @return {void}
     *
     * @private
     */
    private _applyScopes;
    /**
     * Adds a where clause on pivot table by prefixing
     * the pivot table name.
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
     * Selecting fields from foriegn table and pivot
     * table
     *
     * @method _selectFields
     *
     * @return {void}
     */
    _selectFields(): void;
    /**
     * Makes the join query
     *
     * @method _makeJoinQuery
     *
     * @return {void}
     *
     * @private
     */
    private _makeJoinQuery;
    /**
     * Prepares the query to run an aggregate functions
     *
     * @method _prepareAggregate
     *
     * @return {void}
     *
     * @private
     */
    private _prepareAggregate;
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
     * The pivot table values are sideloaded, so we need to remove
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
     * Saves the relationship to the pivot table
     *
     * @method _attachSingle
     * @async
     *
     * @param  {Number|String}      value
     * @param  {Function}           [pivotCallback]
     * @param  {Object}             [trx]
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
     * The colums to be selected from the related
     * query
     *
     * @method select
     *
     * @param  {Array} columns
     *
     * @chainable
     */
    select(columns: any[], ...args: any[]): BelongsToMany;
    /**
     * Define a fully qualified model to be used for
     * making pivot table queries and using defining
     * pivot table settings.
     *
     * @method pivotModel
     *
     * @param  {Model}   pivotModel
     *
     * @chainable
     */
    pivotModel(pivotModel: Model): BelongsToMany;
    /**
     * Define the pivot table
     *
     * @method pivotTable
     *
     * @param  {String}   table
     *
     * @chainable
     */
    pivotTable(table: string): BelongsToMany;
    /**
     * Define the primary key to be selected for the
     * pivot table.
     *
     * @method pivotPrimaryKey
     *
     * @param  {String}        key
     *
     * @chainable
     */
    pivotPrimaryKey(key: string): BelongsToMany;
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
     * Fields to be selected from pivot table
     *
     * @method withPivot
     *
     * @param  {Array}  fields
     *
     * @chainable
     */
    withPivot(fields: any[]): BelongsToMany;
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
     * Make a where clause on the pivot table
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
     * Make a orWhere clause on the pivot table
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
     * Make a andWhere clause on the pivot table
     *
     * @method andWherePivot
     *
     * @param  {String}     key
     * @param  {...Spread}  args
     *
     * @chainable
     */
    andWherePivot(key: string, ...args: Spread[]): BelongsToMany;
    /**
     * Where clause on pivot table
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
     * Fetch ids for the related model
     *
     * @method ids
     *
     * @return {Array}
     */
    ids(): any[];
    /**
     * Execute the query and setup pivot values
     * as a relation
     *
     * @method fetch
     * @async
     *
     * @return {Serializer}
     */
    fetch(): Serializer;
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
     * Returns the query for pivot table
     *
     * @method pivotQuery
     *
     * @param {Boolean} selectFields
     *
     * @return {Object}
     */
    pivotQuery(selectFields?: boolean): Object;
    /**
     * Adds a where clause to limit the select search
     * to related rows only.
     *
     * @method relatedWhere
     *
     * @param  {Boolean}     count
     * @param  {Integer}     counter
     *
     * @return {Object}
     */
    relatedWhere(count: boolean, counter: Integer): Object;
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
     * Attach existing rows inside pivot table as a relationship
     *
     * @method attach
     *
     * @param  {Number|String|Array} references
     * @param  {Function} [pivotCallback]
     * @param  {trx} Transaction
     *
     * @return {Promise}
     */
    attach(references: number | string | any[], pivotCallback?: Function | undefined, trx: any): Promise<any>;
    /**
     * Delete related model rows in bulk and also detach
     * them from the pivot table.
     *
     * NOTE: This method will run 3 queries in total. First is to
     * fetch the related rows, next is to delete them and final
     * is to remove the relationship from pivot table.
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
     * Detach existing relations from the pivot table
     *
     * @method detach
     * @async
     *
     * @param  {Array}  references
     * @param  {Object} trx
     *
     * @return {Number}  The number of effected rows
     */
    detach(references: any[], trx: Object): number;
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
    sync(references: any, pivotCallback?: Function | undefined, trx: any): void;
    /**
     * Save the related model instance and setup the relationship
     * inside pivot table
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
     * the relationship inside pivot table
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
