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
     * The attributes to be considered as ObjectID.
     * By default ['_id'] are considered as ObjectID.
     *
     * @attribute objectIDs
     *
     * @return {Array}
     *
     * @static
     */
    static get objectIDs(): any[];
    /**
     * The attributes to be considered as location. By default [] are considered as location.
     *
     * @attribute geometries
     *
     * @return {Array}
     *
     * @static
     */
    static get geometries(): any[];
    /**
     * Boolean fields will auto convert to boolean
     *
     * @return {Array}
     *
     * @public
     */
    public static get booleans(): any[];
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
    static formatField(key: any, value: any): any;
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
     * Format objectID fields
     *
     * @method formatObjectID
     *
     * @param  {String}    key
     * @param  {String|ObjectID}    value
     *
     * @return {String}
     */
    static formatObjectID(key: string, value: string | ObjectID): string;
    /**
     * Format boolean fields
     *
     * @method formatBooleans
     *
     * @param  {String}    key
     * @param  {Any}    value
     *
     * @return {String}
     */
    static formatBoolean(key: string, value: Any): string;
    /**
     * Format geometry fields
     *
     * @method formatGeometry
     *
     * @param  {String}    key
     * @param  {Object|Geometry}    value
     *
     * @return {String}
     */
    static formatGeometry(key: string, value: Object | Geometry): string;
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
     * This method is executed when toJSON is called on a
     * model or collection of models.
     *
     * @method castObjectID
     *
     * @param  {String}  key
     * @param  {Moment}  value
     *
     * @return {String}
     *
     * @static
     */
    static castObjectID(key: string, value: Moment): string;
    /**
     * This method is executed when toJSON is called on a
     * model or collection of models.
     *
     * @method castGeometry
     *
     * @param  {String}  key
     * @param  {Moment}  value
     *
     * @return {String}
     *
     * @static
     */
    static castGeometry(key: string, value: Moment): string;
    /**
     * This method is executed when set value of attribute.
     *
     * @method parseDates
     *
     * @param  {String}  key
     * @param  {String|Moment}  value
     *
     * @return {String}
     *
     * @static
     */
    static parseDates(key: string, value: string | Moment): string;
    /**
     * This method is executed when set value of attribute.
     *
     * @method parseObjectID
     *
     * @param  {String}  key
     * @param  {String|ObjectID}  value
     *
     * @return {ObjectID}
     *
     * @static
     */
    static parseObjectID(key: string, value: string | ObjectID): ObjectID;
    /**
     * This method is executed when set value of attribute.
     *
     * @method parseGeometry
     *
     * @param  {String}  key
     * @param  {Object}  value
     *
     * @return {GeoPoint}
     *
     * @static
     */
    static parseGeometry(key: string, value: Object): GeoPoint;
    /**
     * This method is executed when set value of attribute.
     *
     * @method parseBoolean
     *
     * @param  {String}  key
     * @param  {any}  value
     *
     * @return {bool}
     *
     * @static
     */
    static parseBoolean(key: string, value: any): bool;
    constructor(attributes?: {});
    /**
     * This method is executed when set value of attribute.
     *
     * @param {String} key
     * @param {any} value
     * @returns {any}
     */
    _convertFieldToObjectInstance(key: string, value: any): any;
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
    $unsetAttributes: {} | undefined;
    $persisted: boolean | undefined;
    $originalAttributes: {} | undefined;
    $relations: {} | undefined;
    $sideLoaded: {} | undefined;
    $parent: any;
    $frozen: boolean | undefined;
    $visible: any;
    $hidden: any;
    /**
     * Unset attribute
     *
     * @param {string} key
     */
    unset(key: string): void;
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
     * @method merge
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
