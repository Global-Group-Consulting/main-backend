export = MorphMany;
declare class MorphMany extends BaseRelation {
    /**
     * Creates an instance of MorphMany.
     *
     * @param {String} parentInstance
     * @param {String} related
     * @param {String} determiner
     * @param {String} localKey
     * @param {String} primaryKey
     *
     * @memberOf MorphMany
     */
    constructor(parentInstance: string, RelatedModel: any, determiner: string, localKey: string, primaryKey: string);
    localKey: string;
    determiner: string;
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
    fetch(): any;
    /**
     * Save related instance
     *
     * @param {RelatedModel} relatedInstance
     * @returns
     *
     * @memberOf MorphMany
     */
    save(relatedInstance: RelatedModel): Promise<any>;
    /**
     * Create related instance
     *
     * @param {Object} payload
     * @returns {Promise}
     *
     * @memberOf MorphMany
     */
    create(payload: Object): Promise<any>;
    createMany(): void;
    saveMany(): void;
}
import BaseRelation = require("./BaseRelation");
