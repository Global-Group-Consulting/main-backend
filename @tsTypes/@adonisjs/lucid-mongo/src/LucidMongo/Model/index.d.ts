import BelongsTo from '../Relations/BelongsTo'

export = Model;
/**
 * Lucid model is a base model and supposed to be
 * extended by other models.
 *
 * @binding Adonis/Src/Model
 * @alias Model
 * @group Database
 *
 * @class Model
 */
declare class Model extends BaseModel {
    /**
     * Boot model if not booted. This method is supposed
     * to be executed via IoC container hooks.
     *
     * @method _bootIfNotBooted
     *
     * @return {void}
     *
     * @private
     *
     * @static
     */
    private static _bootIfNotBooted;
    /**
     * An array of methods to be called everytime
     * a model is imported via ioc container.
     *
     * @attribute iocHooks
     *
     * @return {Array}
     *
     * @static
     */
    static get iocHooks(): any[];
    /**
     * Making sure that `ioc.make` returns
     * the class object and not it's
     * instance
     *
     * @method makePlain
     *
     * @return {Boolean}
     */
    static get makePlain(): boolean;
    /**
     * The primary key for the model. You can change it
     * to anything you want, just make sure that the
     * value of this key will always be unique.
     *
     * @attribute primaryKey
     *
     * @return {String} The default value is `id`
     *
     * @static
     */
    static get primaryKey(): string;
    /**
     * The foreign key for the model. It is generated
     * by converting model name to lowercase and then
     * snake case and appending `_id` to it.
     *
     * @attribute foreignKey
     *
     * @return {String}
     *
     * @example
     * ```
     * User - user_id
     * Post - post_id
     * ``
     */
    static get foreignKey(): string;
    /**
     * Tell Lucid whether primary key is supposed to be incrementing
     * or not. If `false` is returned then you are responsible for
     * setting the `primaryKeyValue` for the model instance.
     *
     * @attribute incrementing
     *
     * @return {Boolean}
     *
     * @static
     */
    static get incrementing(): boolean;
    /**
     * The collection name for the model. It is dynamically generated
     * from the Model name by pluralizing it and converting it
     * to lowercase.
     *
     * @attribute collection
     *
     * @return {String}
     *
     * @static
     *
     * @example
     * ```
     * Model - User
     * collection - users
     *
     * Model - Person
     * collection - people
     * ```
     */
    static get collection(): string;
    /**
     * Get fresh instance of query builder for
     * this model.
     *
     * @method query
     *
     * @return {LucidQueryBuilder}
     *
     * @static
     */
    static query(params: any): LucidQueryBuilder;
    /**
     * Method to be called only once to boot
     * the model.
     *
     * NOTE: This is called automatically by the IoC
     * container hooks when you make use of `use()`
     * method.
     *
     * @method boot
     *
     * @return {void}
     *
     * @static
     */
    static boot(): void;
    /**
     * Hydrates model static properties by re-setting
     * them to their original value.
     *
     * @method hydrate
     *
     * @return {void}
     *
     * @static
     */
    static hydrate(): void;
    /**
     * Define a query macro to be added to query builder.
     *
     * @method queryMacro
     *
     * @param  {String}   name
     * @param  {Function} fn
     *
     * @chainable
     */
    static queryMacro(name: string, fn: Function): typeof Model;
    /**
     * Adds a new hook for a given event type.
     *
     * @method addHook
     *
     * @param  {String} forEvent
     * @param  {Function|String|Array} handlers
     *
     * @chainable
     *
     * @static
     */
    static addHook(forEvent: string, handlers: Function | string | any[]): typeof Model;
    /**
     * Adds the global scope to the model global scopes.
     *
     * You can also give name to the scope, since named
     * scopes can be removed when executing queries.
     *
     * @method addGlobalScope
     *
     * @param  {Function}     callback
     * @param  {String}       [name = null]
     */
    static addGlobalScope(callback: Function, name?: string | undefined): typeof Model;
    /**
     * Attach a listener to be called everytime a query on
     * the model is executed.
     *
     * @method onQuery
     *
     * @param  {Function} callback
     *
     * @chainable
     */
    static onQuery(callback: Function): typeof Model;
    /**
     * Adds a new trait to the model. Ideally it does a very
     * simple thing and that is to pass the model class to
     * your trait and you own it from there.
     *
     * @method addTrait
     *
     * @param  {Function|String} trait - A plain function or reference to IoC container string
     */
    static addTrait(trait: Function | string, options?: {}): void;
    /**
     * Creates a new model instances from payload
     * and also persist it to database at the
     * same time.
     *
     * @method create
     *
     * @param  {Object} payload
     *
     * @return {Model} Model instance is returned
     */
    static create(payload: Object): Model;
    /**
     * Creates many instances of model in parallel.
     *
     * @method createMany
     *
     * @param  {Array} payloadArray
     *
     * @return {Array} Array of model instances is returned
     *
     * @throws {InvalidArgumentException} If payloadArray is not an array
     */
    static createMany(payloadArray: any[]): any[];
    /**
     * Find a row using the primary key
     *
     * @method find
     * @async
     *
     * @param  {String|Number} value
     *
     * @return {Model|Null}
     */
    static find(value: string | number): Model | null;
    /**
     * Find a row using the primary key or
     * fail with an exception
     *
     * @method findByOrFail
     * @async
     *
     * @param  {String|Number}     value
     *
     * @return {Model}
     *
     * @throws {ModelNotFoundException} If unable to find row
     */
    static findOrFail(value: string | number): Model;
    /**
     * Find a model instance using key/value pair
     *
     * @method findBy
     * @async
     *
     * @param  {String} key
     * @param  {String|Number} value
     *
     * @return {Model|Null}
     */
    static findBy(key: string, value: string | number): Model | null;
    /**
     * Find a model instance using key/value pair or
     * fail with an exception
     *
     * @method findByOrFail
     * @async
     *
     * @param  {String}     key
     * @param  {String|Number}     value
     *
     * @return {Model}
     *
     * @throws {ModelNotFoundException} If unable to find row
     */
    static findByOrFail(key: string, value: string | number): Model;
    /**
     * Returns the first row. This method will add orderBy asc
     * clause
     *
     * @method first
     * @async
     *
     * @return {Model|Null}
     */
    static first(): Model | null;
    /**
     * Returns the first row or throw an exception.
     * This method will add orderBy asc clause.
     *
     * @method first
     * @async
     *
     * @return {Model}
     *
     * @throws {ModelNotFoundException} If unable to find row
     */
    static firstOrFail(): Model;
    /**
   * Find a row or create a new row when it doesn't
   * exists.
   *
   * @method findOrCreate
   * @async
   *
   * @param  {Object}     whereClause
   * @param  {Object}     payload
   * @param  {Object}     [trx]
   *
   * @return {Model}
   */
    static findOrCreate(whereClause: Object, payload: Object, trx?: Object | undefined): Model;
    /**
     * Find row from database or returns an instance of
     * new one.
     *
     * @method findOrNew
     *
     * @param  {Object}  whereClause
     * @param  {Object}  payload
     *
     * @return {Model}
     */
    static findOrNew(whereClause: Object, payload: Object): Model;
    /**
     * Fetch everything from the database
     *
     * @method all
     * @async
     *
     * @return {Collection}
     */
    static all(): Collection;
    /**
     * Override primary key value.
     *
     * Note: You should know what you are doing, since primary
     * keys are supposed to be fetched automatically from
     * the database table.
     *
     * The only time you want to do is when `incrementing` is
     * set to false
     *
     * @attribute primaryKeyValue
     *
     * @param  {Mixed}        value
     *
     * @return {void}
     */
    set primaryKeyValue(arg: Mixed);
    /**
     * Returns the value of primary key regardless of
     * the key name.
     *
     * @attribute primaryKeyValue
     *
     * @return {Mixed}
     */
    get primaryKeyValue(): Mixed;
    /**
     * Naming convention of Collections and Fields are snake or camel case
     *
     * @readonly
     */
    readonly get nameConvention(): string;
    /**
     * Returns an object of values dirty after persisting to
     * database or after fetching from database.
     *
     * @attribute dirty
     *
     * @return {Object}
     */
    get dirty(): Object;
    /**
     * Tells whether model is dirty or not
     *
     * @attribute isDirty
     *
     * @return {Boolean}
     */
    get isDirty(): boolean;
    /**
     * Returns a boolean indicating if model is
     * child of a parent model
     *
     * @attribute hasParent
     *
     * @return {Boolean}
     */
    get hasParent(): boolean;
    /**
     * Formats the date fields from the payload, only
     * when they are marked as dates and there are
     * no setters defined for them.
     *
     * Note: This method will mutate the existing object. If
     * any part of your application doesn't want mutations
     * then pass a cloned copy of object
     *
     * @method _formatFields
     *
     * @param  {Object}          values
     *
     * @return {Object}
     *
     * @private
     */
    private _formatFields;
    /**
     * Checks for existence of setter on model and if exists
     * returns the return value of setter, otherwise returns
     * the default value.
     *
     * @method _getSetterValue
     *
     * @param  {String}        key
     * @param  {Mixed}        value
     *
     * @return {Mixed}
     *
     * @private
     */
    private _getSetterValue;
    /**
     * Checks for existence of getter on model and if exists
     * returns the return value of getter, otherwise returns
     * the default value
     *
     * @method _getGetterValue
     *
     * @param  {String}        key
     * @param  {Mixed}         value
     * @param  {Mixed}         [passAttrs = null]
     *
     * @return {Mixed}
     *
     * @private
     */
    private _getGetterValue;
    /**
     * Sets `created_at` column on the values object.
     *
     * Note: This method will mutate the original object
     * by adding a new key/value pair.
     *
     * @method _setCreatedAt
     *
     * @param  {Object}     values
     *
     * @private
     */
    private _setCreatedAt;
    /**
     * Sets `updated_at` column on the values object.
     *
     * Note: This method will mutate the original object
     * by adding a new key/value pair.
     *
     * @method _setUpdatedAt
     *
     * @param  {Object}     values
     *
     * @private
     */
    private _setUpdatedAt;
    /**
     * Sync the original attributes with actual attributes.
     * This is done after `save`, `update` and `find`.
     *
     * After this `isDirty` should return `false`.
     *
     * @method _syncOriginals
     *
     * @return {void}
     *
     * @private
     */
    private _syncOriginals;
    /**
     * Insert values to the database. This method will
     * call before and after hooks for `create` and
     * `save` event.
     *
     * @method _insert
     * @async
     *
     * @return {Boolean}
     *
     * @private
     */
    private _insert;
    /**
     * Update model by updating dirty attributes to the database.
     *
     * @method _update
     * @async
     *
     * @return {Boolean}
     */
    _update(): boolean;
    /**
     * Converts all fields to objects: moment, ObjectID, GeoPoint, so
     * that you can transform them into something
     * else.
     *
     * @method _convertFieldToObjectInstances
     *
     * @return {void}
     *
     * @private
     */
    private _convertFieldToObjectInstances;
    /**
     * Set attribute on model instance. Setting properties
     * manually or calling the `set` function has no
     * difference.
     *
     * NOTE: this method will call the setter
     *
     * @method set
     *
     * @param  {String} name
     * @param  {Mixed} value
     *
     * @return {void}
     */
    set(name: string, value: Mixed): void;
    /**
     * Converts model to an object. This method will call getters,
     * cast dates and will attach `computed` properties to the
     * object.
     *
     * @method toObject
     *
     * @return {Object}
     */
    toObject(): Object;
    /**
     * Persist model instance to the database. It will create
     * a new row when model has not been persisted already,
     * otherwise will update it.
     *
     * @method save
     * @async
     *
     * @return {Boolean} Whether or not the model was persisted
     */
    save(): boolean;
    /**
     * Deletes the model instance from the database. Also this
     * method will freeze the model instance for updates.
     *
     * @method delete
     * @async
     *
     * @return {Boolean}
     */
    delete(): boolean;
    /**
     * Perform required actions to newUp the model instance. This
     * method does not call setters since it is supposed to be
     * called after `fetch` or `find`.
     *
     * @method newUp
     *
     * @param  {Object} row
     *
     * @return {void}
     */
    newUp(row: Object): void;
    /**
     * Sets a preloaded relationship on the model instance
     *
     * @method setRelated
     *
     * @param  {String}   key
     * @param  {Object|Array}   value
     *
     * @throws {RuntimeException} If trying to set a relationship twice.
     */
    setRelated(key: string, value: Object | any[]): void;
    /**
     * Returns the relationship value
     *
     * @method getRelated
     *
     * @param  {String}   key
     *
     * @return {Object}
     */
    getRelated(key: string): Object;
    /**
     * Loads relationships and set them as $relations
     * attribute.
     *
     * To load multiple relations, call this method for
     * multiple times
     *
     * @method load
     * @async
     *
     * @param  {String}   relation
     * @param  {Function} callback
     *
     * @return {void}
     */
    load(relation: string, callback: Function): void;
    /**
     * Just like @ref('Model.load') but instead loads multiple relations for a
     * single model instance.
     *
     * @method loadMany
     * @async
     *
     * @param  {Object} eagerLoadMap
     *
     * @return {void}
     */
    loadMany(eagerLoadMap: Object): void;
    /**
     * Returns an instance of @ref('HasOne') relation.
     *
     * @method hasOne
     *
     * @param  {String|Class}  relatedModel
     * @param  {String}        primaryKey
     * @param  {String}        foreignKey
     *
     * @return {HasOne}
     */
    hasOne(relatedModel: string | Class, primaryKey: string, foreignKey: string): typeof import("../Relations/HasOne");
    /**
     * Returns an instance of @ref('HasMany') relation
     *
     * @method hasMany
     *
     * @param  {String|Class}  relatedModel
     * @param  {String}        primaryKey
     * @param  {String}        foreignKey
     *
     * @return {HasMany}
     */
    hasMany(relatedModel: string | Class, primaryKey: string, foreignKey: string): typeof import("../Relations/HasMany");
    /**
     * Returns an instance of @ref('BelongsTo') relation
     *
     * @method belongsTo
     *
     * @param  {String|Class}  relatedModel
     * @param  {String}        primaryKey
     * @param  {String}        foreignKey
     *
     * @return {BelongsTo}
     */
    belongsTo(relatedModel: string | Class, primaryKey: string, foreignKey: string):  BelongsTo;
    /**
     * Returns an instance of @ref('BelongsToMany') relation
     *
     * @method belongsToMany
     *
     * @param  {Class|String}      relatedModel
     * @param  {String}            foreignKey
     * @param  {String}            relatedForeignKey
     * @param  {String}            primaryKey
     * @param  {String}            relatedPrimaryKey
     *
     * @return {BelongsToMany}
     */
    belongsToMany(relatedModel: Class | string, foreignKey: string, relatedForeignKey: string, primaryKey: string, relatedPrimaryKey: string): typeof import("../Relations/BelongsToMany");
    /**
     * Returns instance of @ref('HasManyThrough')
     *
     * @method manyThrough
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    relatedMethod
     * @param  {String}    primaryKey
     * @param  {String}    foreignKey
     *
     * @return {HasManyThrough}
     */
    manyThrough(relatedModel: Class | string, relatedMethod: string, primaryKey: string, foreignKey: string): typeof import("../Relations/HasManyThrough");
    /**
     * Returns instance of @ref('MorphMany')
     *
     * @method morphMany
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    determiner
     * @param  {String}    localKey
     * @param  {String}    primaryKey
     *
     * @return {MorphMany}
     */
    morphMany(relatedModel: Class | string, determiner: string, localKey: string, primaryKey: string): typeof import("../Relations/MorphMany");
    /**
     * Returns instance of @ref('MorphOne')
     *
     * @method morphOne
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    determiner
     * @param  {String}    localKey
     * @param  {String}    primaryKey
     *
     * @return {MorphOne}
     */
    morphOne(relatedModel: Class | string, determiner: string, localKey: string, primaryKey: string): typeof import("../Relations/MorphOne");
    /**
     * Returns instance of @ref('MorphTo')
     *
     * @method morphTo
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    modelPath
     * @param  {String}    determiner
     * @param  {String}    primaryKey
     * @param  {String}    foreignKey
     *
     * @return {MorphMany}
     */
    morphTo(modelPath: string, determiner: string, primaryKey: string, foreignKey: string): typeof import("../Relations/MorphMany");
    /**
     * Returns instance of @EmbedsMany')
     *
     * @method embedsMany
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    modelPath
     * @param  {String}    primaryKey
     * @param  {String}    foreignKey
     *
     * @return {EmbedsMany}
     */
    embedsMany(relatedModel: Class | string, primaryKey: string, foreignKey: string): typeof import("../Relations/EmbedsMany");
    /**
     * Returns instance of @ref('EmbedsOne')
     *
     * @method embedsOne
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    modelPath
     * @param  {String}    primaryKey
     * @param  {String}    foreignKey
     *
     * @return {EmbedsOne}
     */
    embedsOne(relatedModel: Class | string, primaryKey: string, foreignKey: string): typeof import("../Relations/EmbedsOne");
    /**
     * Returns instance of @ref('ReferMany')
     *
     * @method referMany
     *
     * @param  {Class|String}    relatedModel
     * @param  {String}    modelPath
     * @param  {String}    primaryKey
     * @param  {String}    foreignKey
     *
     * @return {ReferMany}
     */
    referMany(relatedModel: Class | string, primaryKey: string, foreignKey: string): typeof import("../Relations/ReferMany");
    /**
     * Reload the model instance in memory. Some may
     * not like it, but in real use cases no one
     * wants a new instance.
     *
     * @method reload
     *
     * @return {void}
     */
    reload(): void;
}
import BaseModel = require("./Base");
