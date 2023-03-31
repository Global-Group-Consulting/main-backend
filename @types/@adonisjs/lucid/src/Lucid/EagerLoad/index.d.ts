export = EagerLoad;
/**
 * This class makes the required queries and returned transformed
 * output of eagerloaded relations.
 *
 * Also multiple relations are resolved parallely
 *
 * @class EagerLoad
 * @constructor
 */
declare class EagerLoad {
    constructor(relations: any);
    _relations: Object;
    /**
     * Calls the eagerloading callback on the related instance
     * query only when defined
     *
     * @method _applyRuntimeConstraints
     *
     * @param  {Object}     relationInstance
     * @param  {Function}   callback
     *
     * @return {void}
     *
     * @private
     */
    private _applyRuntimeConstraints;
    /**
     * Chain the nested relationship by calling `with`
     * on the relationship instance and this goes on
     * recursively.
     *
     * @method _chainNested
     *
     * @param  {Object}     options.relatedQuery
     * @param  {Object}     nested
     *
     * @return {void}
     *
     * @private
     */
    private _chainNested;
    /**
     * Loads a single relationship of the model. This method
     * will execute parallel queries for multiple relations.
     *
     * The return value is a key/value pair of relations and
     * their resolved values.
     *
     * @method loadForOne
     *
     * @return {Object}
     */
    loadForOne(modelInstance: any): Object;
    /**
     * Load relationships for all the model instances and set
     * relationships on the model instances using @ref('Model.setRelated')
     *
     * @method load
     *
     * @param  {Array} modelInstances
     *
     * @return {void}
     */
    load(modelInstances: any[]): void;
}
