export = BaseModel;
/**
 * The base model to share attributes with Lucid
 * model and the Pivot model.
 *
 * @class BaseModel
 * @constructor
 */
declare class BaseModel {
    /**
     * The attributes to be considered as dates. By default
     * @ref('Model.createdAtColumn') and @ref('Model.updatedAtColumn')
     * are considered as dates.
     *
     * @attribute dates
     *
     * @return {Array}
     *
     * @static
     */
    static get dates(): any[];
    /**
     * The attribute name for created at timestamp.
     *
     * @attribute createdAtColumn
     *
     * @return {String}
     *
     * @static
     */
    static get createdAtColumn(): string;
    /**
     * The attribute name for updated at timestamp.
     *
     * @attribute updatedAtColumn
     *
     * @return {String}
     *
     * @static
     */
    static get updatedAtColumn(): string;
    /**
     * The serializer to be used for serializing
     * data. The return value must always be a
     * ES6 class.
     *
     * By default Lucid uses @ref('VanillaSerializer')
     *
     * @attribute Serializer
     *
     * @return {Class}
     */
    static get Serializer(): Class;
    /**
     * The database connection to be used for
     * the model. Returning blank string will
     * use the `default` connection.
     *
     * @attribute connection
     *
     * @return {String}
     *
     * @static
     */
    static get connection(): string;
    /**
     * This method is executed for all the date fields
     * with the field name and the value. The return
     * value gets saved to the database.
     *
     * Also if you have defined a setter for a date field
     * this method will not be executed for that field.
     *
     * @method formatDates
     *
     * @param  {String}    key
     * @param  {String|Date}    value
     *
     * @return {String}
     */
    static formatDates(key: string, value: string | Date): string;
    /**
     * Resolves the serializer for the current model.
     *
     * If serializer is a string, then it is resolved using
     * the Ioc container, otherwise it is assumed that
     * a `class` is returned.
     *
     * @method resolveSerializer
     *
     * @returns {Class}
     */
    static resolveSerializer(): Class;
    /**
     * This method is executed when toJSON is called on a
     * model or collection of models. The value received
     * will always be an instance of momentjs and return
     * value is used.
     *
     * NOTE: This method will not be executed when you define
     * a getter for a given field.
     *
     * @method castDates
     *
     * @param  {String}  key
     * @param  {Moment}  value
     *
     * @return {String}
     *
     * @static
     */
    static castDates(key: string, value: Moment): string;
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
     * Tells whether model instance is new or
     * persisted to database.
     *
     * @attribute isNew
     *
     * @return {Boolean}
     */
    get isNew(): boolean;
    /**
     * Returns a boolean indicating whether model
     * has been deleted or not
     *
     * @method isDeleted
     *
     * @return {Boolean}
     */
    get isDeleted(): boolean;
    /**
     * Instantiate the model by defining constructor properties
     * and also setting `__setters__` to tell the proxy that
     * these values should be set directly on the constructor
     * and not on the `attributes` object.
     *
     * @method instantiate
     *
     * @return {void}
     *
     * @private
     */
    private _instantiate;
    __setters__: string[] | undefined;
    $attributes: {} | undefined;
    $persisted: boolean | undefined;
    $originalAttributes: {} | undefined;
    $relations: {} | undefined;
    $sideLoaded: {} | undefined;
    $parent: any;
    $frozen: boolean | undefined;
    $visible: any;
    $hidden: any;
    /**
     * Set attributes on model instance in bulk.
     *
     * NOTE: Calling this method will remove the existing attributes.
     *
     * @method fill
     *
     * @param  {Object} attributes
     *
     * @return {void}
     */
    fill(attributes: Object): void;
    /**
     * Merge attributes into on a model instance without
     * overriding existing attributes and their values
     *
     * @method fill
     *
     * @param  {Object} attributes
     *
     * @return {void}
     */
    merge(attributes: Object): void;
    /**
     * Freezes the model instance for modifications
     *
     * @method freeze
     *
     * @return {void}
     */
    freeze(): void;
    /**
     * Unfreezes the model allowing further modifications
     *
     * @method unfreeze
     *
     * @return {void}
     */
    unfreeze(): void;
    /**
     * Converts model instance toJSON using the serailizer
     * toJSON method
     *
     * @method toJSON
     *
     * @return {Object}
     */
    toJSON(): Object;
}
