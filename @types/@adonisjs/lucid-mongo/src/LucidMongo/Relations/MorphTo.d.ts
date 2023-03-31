export = MorphTo;
declare class MorphTo {
    /**
     * Creates an instance of MorphTo.
     *
     * @param {String} parentInstance
     * @param {String} related
     * @param {String} determiner
     * @param {String} primaryKey
     * @param {String} foreignKey
     *
     * @memberOf MorphTo
     */
    constructor(parentInstance: string, modelPath: any, determiner: string, primaryKey: string, foreignKey: string);
    parentInstance: string;
    primaryKey: any;
    foreignKey: string;
    modelPath: any;
    determiner: string;
    /**
     * will eager load the relation for multiple values on related
     * model and returns an object with values grouped by foreign
     * key.
     *
     * @param {Array} rows
     * @return {Object}
     *
     * @public
     *
     */
    public eagerLoad(rows: any[]): Object;
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
     * Save related instance is not support
     *
     * @param {any} relatedInstance
     * @returns
     *
     * @memberOf MorphTo
     */
    save(relatedInstance: any): Promise<void>;
    /**
     * belongsTo cannot have paginate, since it
     * maps one to one relationship
     *
     * @public
     *
     * @throws CE.ModelRelationException
     */
    public paginate(): Promise<void>;
    /**
     *
     * @public
     *
     */
    public first(): any;
    /**
     *
     * @public
     *
     */
    public fetch(): any;
}
