export = FormFields;
/**
 * FormFields class is used to handle array of or nested fields
 * when parsing multipart data.
 *
 * @class FormFields
 * @constructor
 */
declare class FormFields {
    _fields: {};
    /**
     * Add key/value pair to the object. Which handles
     * string expression on keys. For example
     *
     * @example
     * ```
     *  user[0][age] => { user: [{age}] }
     * ```
     *
     * @method add
     *
     * @param  {String} key
     * @param  {Mixed} value
     */
    add(key: string, value: Mixed): void;
    /**
     * Returns the serialized object
     *
     * @method get
     *
     * @return {Object}
     */
    get(): Object;
}
