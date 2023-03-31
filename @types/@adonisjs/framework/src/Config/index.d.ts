export = Config;
/**
 * Manages configuration by recursively reading all
 * `.js` files from the `config` folder.
 *
 * @alias Config
 * @binding Adonis/Src/Config
 * @group Core
 * @singleton
 *
 * @class Config
 * @constructor
 *
 * @param {String} configPath Absolute path from where to load the config files from
 */
declare class Config {
    constructor(configPath: any);
    _configPath: any;
    _config: {};
    /**
     * Syncs the in-memory config store with the
     * file system. Ideally you should keep your
     * config static and never update the file
     * system on the fly.
     *
     * @method syncWithFileSystem
     *
     * @return {void}
     */
    syncWithFileSystem(): void;
    /**
     * Get value for a given key from the config store. Nested
     * values can be accessed via (dot notation). Values
     * referenced with `self::` are further resolved.
     *
     * @method get
     *
     * @param  {String} key
     * @param  {Mixed} [defaultValue]
     *
     * @return {Mixed}
     *
     * @example
     * ```
     * Config.get('database.mysql')
     *
     * // referenced
     * {
     *   prodMysql: 'self::database.mysql'
     * }
     * Config.get('database.prodMysql')
     * ```
     */
    get(key: string, defaultValue?: any): Mixed;
    /**
     * Merge default values with the resolved values.
     * This is to provide a default set of values
     * when it does not exists. This method uses
     * lodash `_.mergeWith` method.
     *
     * @method merge
     *
     * @param  {String}   key
     * @param  {Object}   defaultValues
     * @param  {Function} [customizer]
     *
     * @return {Object}
     *
     * @example
     * ```js
     * Config.merge('services.redis', {
     *   port: 6379,
     *   host: 'localhost'
     * })
     * ```
     */
    merge(key: string, defaultValues: Object, customizer?: Function | undefined): Object;
    /**
     * Update value for a given key inside the config store. If
     * value does not exists it will be created.
     *
     * ## Note
     * This method updates the value in memory and not on the
     * file system.
     *
     * @method set
     *
     * @param  {String} key
     * @param  {Mixed}  value
     *
     * @example
     * ```js
     * Config.set('database.mysql.host', '127.0.0.1')
     *
     * // later get the value
     * Config.get('database.mysql.host')
     * ```
     */
    set(key: string, value: Mixed): void;
}
