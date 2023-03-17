export = SeedDatabase;
declare class SeedDatabase {
    /**
     * IoC container injections
     *
     * @method inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    /**
     * Command signature required by ace
     *
     * @method signature
     *
     * @return {String}
     */
    static get signature(): string;
    /**
     * Command description
     *
     * @method description
     *
     * @return {String}
     */
    static get description(): string;
    constructor(Helpers: any, Database: any);
    _seedsPath: any;
    Database: any;
    /**
     * Returns an object of all schema files
     *
     * @method _getSeedFiles
     *
     * @return {Object}
     *
     * @private
     */
    private _getSeedFiles;
    /**
     * Throws exception when trying to run migrations are
     * executed in production and not using force flag.
     *
     * @method _validateState
     *
     * @param  {Boolean}       force
     *
     * @return {void}
     *
     * @private
     *
     * @throws {Error} If NODE_ENV is production
     */
    private _validateState;
    /**
     * Method called when command is executed. This method will
     * require all files from the migrations directory
     * and execute all pending schema files
     *
     * @method handle
     *
     * @param  {Object} args
     * @param  {Boolean} options.force
     * @param  {String} options.files
     * @param  {String} options.keepAlive
     *
     * @return {void|Array}
     */
    handle(args: Object, { force, files, keepAlive }: boolean): void | any[];
}
