export = Env;
/**
 * Manages the application environment variables by
 * reading the `.env` file from the project root.
 *
 * If `.env` file is missing, an exception will be thrown
 * to supress the exception, pass `ENV_SILENT=true` when
 * starting the app.
 *
 * Can define different location by setting `ENV_PATH`
 * environment variable.
 *
 * @binding Adonis/Src/Env
 * @group Core
 * @alias Env
 * @singleton
 *
 * @class Env
 * @constructor
 */
declare class Env {
    constructor(appRoot: any);
    appRoot: any;
    /**
     * Replacing dynamic values inside .env file
     *
     * @method _interpolate
     *
     * @param  {String}     env
     * @param  {Object}     envConfig
     *
     * @return {String}
     *
     * @private
     */
    private _interpolate;
    /**
     * Load env file from a given location.
     *
     * @method load
     *
     * @param  {String}  filePath
     * @param  {Boolean} [overwrite = 'true']
     * @param  {String}  [encoding = 'utf8']
     *
     * @return {Object}
     */
    load(filePath: string, overwrite?: boolean | undefined, encoding?: string | undefined): Object;
    /**
     * Returns the path from where the `.env`
     * file should be loaded.
     *
     * @method getEnvPath
     *
     * @return {String}
     */
    getEnvPath(): string;
    /**
     * Get value for a given key from the `process.env`
     * object.
     *
     * @method get
     *
     * @param  {String} key
     * @param  {Mixed} [defaultValue = null]
     *
     * @return {Mixed}
     *
     * @example
     * ```js
     * Env.get('CACHE_VIEWS', false)
     * ```
     */
    get(key: string, defaultValue?: any): Mixed;
    /**
     * Get value for a given key from the `process.env`
     * object or throw an error if the key does not exist.
     *
     * @method getOrFail
     *
     * @param  {String} key
     *
     * @return {Mixed}
     *
     * @example
     * ```js
     * Env.getOrFail('MAIL_PASSWORD')
     * ```
     */
    getOrFail(key: string): Mixed;
    /**
     * Set value for a given key inside the `process.env`
     * object. If value exists, will be updated
     *
     * @method set
     *
     * @param  {String} key
     * @param  {Mixed} value
     *
     * @return {void}
     *
     * @example
     * ```js
     * Env.set('PORT', 3333)
     * ```
     */
    set(key: string, value: Mixed): void;
}
