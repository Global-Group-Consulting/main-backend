/**
 * Class to throw runtime exceptions
 *
 * @class RuntimeException
 * @constructor
 */
export class RuntimeException {
    /**
     * This exception is raised when user is trying to use an
     * undefined database connection
     *
     * @method missingDatabaseConnection
     *
     * @param  {String}                  name
     *
     * @return {Object}
     */
    static missingDatabaseConnection(name: string): Object;
    /**
     * This exception is raised when user is trying to query
     * relationships from an unsaved model instance
     *
     * @method unSavedModel
     *
     * @param  {String}     name
     *
     * @return {Object}
     */
    static unSavedModel(name: string): Object;
    /**
     * This exception is raised when an undefined relation is
     * fetched or referenced within the code
     *
     * @method undefinedRelation
     *
     * @param  {String}          relation
     * @param  {String}          name
     *
     * @return {Object}
     */
    static undefinedRelation(relation: string, name: string): Object;
    /**
     * This exception is raised when nested relationships are not
     * supported. `withCount` method is an example of same
     *
     * @method cannotNestRelation
     *
     * @param  {String}           relation
     * @param  {String}           parent
     * @param  {String}           method
     *
     * @return {Object}
     */
    static cannotNestRelation(relation: string, parent: string, method: string): Object;
    /**
     * This exception is raised when you are trying to eagerload
     * relationship for multiple times
     *
     * @method overRidingRelation
     *
     * @param  {String}           relation
     *
     * @return {Object}
     */
    static overRidingRelation(relation: string): Object;
    /**
     * This exception is raised when migrations are locked but
     * still someone is trying to migrate the database.
     *
     * @method migrationsAreLocked
     *
     * @param  {String}            lockCollection
     *
     * @return {Object}
     */
    static migrationsAreLocked(lockCollection: string): Object;
}
/**
 * Class to lucid model related exceptions
 *
 * @class ModelException
 * @constructor
 */
export class ModelException {
    static deletedInstance(name: any): ModelException;
}
/**
 * Exception thrown when a row is not found using
 * findOrFail style methods.
 *
 * @class ModelNotFoundException
 * @constructor
 */
export class ModelNotFoundException {
    static raise(name: any): ModelNotFoundException;
}
/**
 * Class to throw exceptions related to model
 * relations
 *
 * @class ModelRelationException
 * @constructor
 */
export class ModelRelationException {
    /**
     * This exception is raised when an unsupported method
     * is called on a model relation. Naturally `xxx` is
     * not a function will be thrown, but we want to
     * be more explicit that `xxx` is not a method
     * for `yyy` relation.
     *
     * @method unSupportedMethod
     *
     * @param  {String}          method
     * @param  {String}          relation
     *
     * @return {Object}
     */
    static unSupportedMethod(method: string, relation: string): Object;
    /**
     * This exception is raised when related model method is
     * executed for which the model needs to be persisted
     * but is not
     *
     * @method unsavedModelInstance
     *
     * @param  {String}             message
     *
     * @return {Object}
     */
    static unsavedModelInstance(message: string): Object;
    /**
     * Exception thrown when trying to set flags on pivot
     * model instance and when pivotModel is explicitly
     * defined
     *
     * @method pivotModelIsDefined
     *
     * @param  {String}            method
     *
     * @return {Object}
     */
    static pivotModelIsDefined(method: string): Object;
}
