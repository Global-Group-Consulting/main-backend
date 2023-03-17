export = EmbedsOne;
declare class EmbedsOne extends BaseRelation {
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
     * Groups related instances with their foreign keys
     *
     * @method group
     *
     * @param  {Array} relatedInstances
     *
     * @return {Object} @multiple([key=String, values=Array, defaultValue=Null])
     */
    group(relatedInstances: any[]): Object;
    /**
     * Save related instance
     *
     * @param {relatedInstance} relatedInstance
     * @returns relatedInstance
     *
     * @memberOf EmbedsOne
     */
    save(relatedInstance: any): Promise<any>;
    /**
     * @method create
     *
     * @param {Object} values
     * @returns relatedInstance
     * @memberOf EmbedsOne
     */
    create(values: Object): Promise<any>;
    /**
     * Remove related instance
     *
     * @returns
     *
     * @memberOf EmbedsOne
     */
    delete(): Promise<any>;
    /**
     * fetch
     *
     * @public
     *
     * @return {Array}
     */
    public fetch(): any[];
    /**
     * Maps a single row to model instance
     *
     * @method _mapRowToInstance
     *
     * @param  {Object}          row
     *
     * @return {Model}
     */
    _mapRowToInstance(embed: any): Model;
    /**
     * fetch
     *
     * @public
     *
     * @return {Object}
     */
    public first(): Object;
    /**
     * belongsTo cannot have paginate, since it
     * maps one to one relationship
     *
     * @public
     *
     * @throws CE.ModelRelationException
     */
    public paginate(): void;
}
import BaseRelation = require("./BaseRelation");
