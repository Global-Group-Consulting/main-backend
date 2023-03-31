export = ModelFactory;
/**
 * Model factory to seed database using Lucid
 * models
 *
 * @class ModelFactory
 * @constructor
 */
declare class ModelFactory {
    constructor(Model: any, dataCallback: any);
    Model: any;
    dataCallback: any;
    /**
     * New up a model with attributes
     *
     * @method _newup
     *
     * @param  {Object} attributes
     *
     * @return {Object}
     *
     * @private
     */
    private _newup;
    /**
     * Make a single instance of blueprint for a given
     * index. This method will evaluate the functions
     * in the return payload from blueprint.
     *
     * @method _makeOne
     * @async
     *
     * @param  {Number} index
     * @param  {Object} data
     *
     * @return {Object}
     *
     * @private
     */
    private _makeOne;
    /**
     * Make a single model instance with attributes
     * from blueprint fake values
     *
     * @method make
     * @async
     *
     * @param  {Object} data
     * @param  {Number} [index = 0]
     *
     * @return {Object}
     */
    make(data?: Object, index?: number | undefined): Object;
    /**
     * Make x number of model instances with
     * fake data
     *
     * @method makeMany
     * @async
     *
     * @param  {Number} instances
     * @param  {Object} [data = {}]
     *
     * @return {Array}
     */
    makeMany(instances: number, data?: Object | undefined): any[];
    /**
     * Create model instance and persist to database
     * and then return it back
     *
     * @method create
     * @async
     *
     * @param  {Object} data
     *
     * @return {Object}
     */
    create(data?: Object, index?: number): Object;
    /**
     * Persist multiple model instances to database and get
     * them back as an array
     *
     * @method createMany
     * @async
     *
     * @param  {Number}   numberOfRows
     * @param  {Object}   [data = {}]
     *
     * @return {Array}
     */
    createMany(numberOfRows: number, data?: Object | undefined): any[];
    /**
     * Truncate the database table
     *
     * @method reset
     * @async
     *
     * @return {Number}
     */
    reset(): number;
}
