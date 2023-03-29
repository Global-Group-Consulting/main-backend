export = BaseRelation;
/**
 * Base relation is supposed to be extended by other
 * relations. It takes care of commonly required
 * stuff.
 *
 * @class BaseRelation
 * @constructor
 */
declare class BaseRelation {
    constructor(parentInstance: any, RelatedModel: any, primaryKey: any, foreignKey: any);
    parentInstance: any;
    RelatedModel: any;
    primaryKey: any;
    foreignKey: any;
    relatedQuery: any;
    /**
     * this is default value to eagerload data, but users
     * can pass their custom function by calling
     * `eagerLoadQuery` method and pass a
     * closure to it.
     *
     * @method _eagerLoadFn
     *
     * @param  {Object} query
     * @param  {String} fk
     * @param  {Array} rows
     *
     * @return {void}
     */
    _eagerLoadFn: (query: Object, fk: string, values: any) => void;
    /**
     * This is set by `relatedWhere` method in case of a self
     * join
     *
     * @type {Number|Null}
     */
    relatedCollectionAlias: number | null;
    /**
     * Define a custom eagerload query.
     *
     * NOTE: Defining eagerload query leaves everything on you
     * to resolve the correct rows and they must be an array
     *
     * @method eagerLoadQuery
     *
     * @return {void}
     */
    eagerLoadQuery(fn: any): void;
    /**
     * Returns the value for the primary key set on
     * the relationship
     *
     * @attribute $primaryKeyValue
     *
     * @return {Mixed}
     */
    get $primaryKeyValue(): Mixed;
    /**
     * The primary collection in relationship
     *
     * @attribute $primaryCollection
     *
     * @return {String}
     */
    get $primaryCollection(): string;
    /**
     * The foreign collection in relationship
     *
     * @attribute $foreignCollection
     *
     * @return {String}
     */
    get $foreignCollection(): string;
    /**
     * Decorates the query instance with the required where
     * clause. This method should be called internally by
     * all read/update methods.
     *
     * @method _decorateQuery
     *
     * @return {void}
     *
     * @private
     */
    private _decorateQuery;
    /**
     * Validates the read operation
     *
     * @method _validateRead
     *
     * @return {void}
     *
     * @throws {RuntimeException} If parent model is not persisted
     *
     * @private
     */
    private _validateRead;
    /**
     * Returns the eagerLoad query for the relationship
     *
     * @method eagerLoad
     * @async
     *
     * @param  {Array}          rows
     *
     * @return {Object}
     */
    eagerLoad(rows: any[]): Object;
    /**
     * Load a single relationship from parent to child
     * model, but only for one row.
     *
     * @method load
     * @async
     *
     * @param  {String|Number}     value
     *
     * @return {Model}
     */
    load(): Model;
    /**
     *
     * @param {object} params
     */
    query(params: object): BaseRelation;
}
