export = EmbedsMany;
declare class EmbedsMany extends BaseRelation {
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
     * @returns
     *
     * @memberOf EmbedsMany
     */
    save(relatedInstance: any): Promise<any>;
    /**
     * @method create
     *
     * @param {Object} values
     * @returns relatedInstance
     * @memberof EmbedsMany
     */
    create(values: Object): Promise<any>;
    /**
     * Remove related instance
     *
     * @param {String|Array} id
     * @returns
     *
     * @memberOf EmbedsMany
     */
    delete(references: any): Promise<any>;
    /**
     * delete all references
     *
     * @return {Number}
     *
     * @public
     */
    public deleteAll(): number;
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
     * find
     *
     * @public
     *
     * @return {Object}
     */
    public find(id: any): Object;
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
