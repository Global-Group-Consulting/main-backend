export = Store;
/**
 * The session store class is used to create a
 * temporary in-memory store of session values.
 * The final set of values are stored with the
 * session driver.
 *
 * @class Store
 * @group Http
 */
declare class Store {
    constructor(values?: null);
    _values: {};
    isDirty: boolean;
    /**
     * Initiates the store by parsing stringied json
     *
     * @method _initiate
     *
     * @param  {String}  values
     *
     * @return {void}
     *
     * @private
     */
    private _initiate;
    /**
     * Returns an object with stringified value
     * and it's type.
     *
     * @method _guardValue
     *
     * @param  {Mixed}  value
     *
     * @return {Object}
     *
     * @private
     */
    private _guardValue;
    /**
     * Unguards the pair and returns it's original
     * value
     *
     * @method _unGuardValue
     *
     * @param  {Object}     pair
     *
     * @return {Mixed}
     *
     * @private
     */
    private _unGuardValue;
    /**
     * Put value to the existing key/value pairs
     *
     * @method put
     *
     * @param  {String} key
     * @param  {Mixed} value
     *
     * @return {void}
     *
     * @example
     * ```js
     * Store.put('name', 'virk')
     *
     * // saving object
     * Store.put('user', { username: 'virk', age: 27 })
     * ```
     */
    put(key: string, value: Mixed): void;
    /**
     * Returns value for a given key
     *
     * @method get
     *
     * @param  {String} key
     * @param  {Mixed} [defaultValue]
     *
     * @return {Mixed}
     *
     * @example
     * ```js
     * Store.get('username')
     *
     * // with default value
     * Store.get('username', 'virk')
     * ```
     */
    get(key: string, defaultValue?: any): Mixed;
    /**
     * Increment value of a key.
     *
     * @method increment
     *
     * @param  {String}  key
     * @param  {Number}  [steps = 1]
     *
     * @return {void}
     *
     * @throws {Error} If the value are you incrementing is not a number
     *
     * @example
     * ```js
     * Store.increment('age')
     * ```
     */
    increment(key: string, steps?: number | undefined): void;
    /**
     * Decrement value of a key
     *
     * @method decrement
     *
     * @param  {String}  key
     * @param  {Number}  [steps = 1]
     *
     * @return {void}
     *
     * @throws {Error} If the value are you decrementing is not a number
     *
     * @example
     * ```js
     * Store.decrement('age')
     * ```
     */
    decrement(key: string, steps?: number | undefined): void;
    /**
     * Remove key/value pair from store
     *
     * @method forget
     *
     * @param  {String} key
     *
     * @return {void}
     *
     * @example
     * ```js
     * Store.forget('username')
     * Store.get('username') // null
     * ```
     */
    forget(key: string): void;
    /**
     * Returns a cloned copy of existing values
     *
     * @method all
     *
     * @return {Object}
     */
    all(): Object;
    /**
     * Returns value for a given key and removes
     * it from the store at the same time
     *
     * @method pull
     *
     * @param  {String} key
     * @param  {Mixed} [defaultValue]
     *
     * @return {Mixed}
     *
     * @example
     * ```js
     * const username = Store.pull('username')
     * Store.get('username') // null
     * ```
     */
    pull(key: string, defaultValue?: any): Mixed;
    /**
     * Clears the existing values from store
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
    /**
     * Returns json representation of object with
     * properly stringfied values
     *
     * @method toJSON
     *
     * @return {Object}
     */
    toJSON(): Object;
}
