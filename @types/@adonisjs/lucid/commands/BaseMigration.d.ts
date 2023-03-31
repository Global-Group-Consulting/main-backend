export = BaseMigration;
declare class BaseMigration {
    static get inject(): string[];
    constructor(migration: any, helpers: any);
    _migrationsPath: any;
    migration: any;
    /**
     * Returns an object of all schema files
     *
     * @method _getSchemaFiles
     *
     * @return {Object}
     *
     * @private
     */
    private _getSchemaFiles;
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
     * Executes the function when conditional
     * is false
     *
     * @method execIfNot
     *
     * @param {Boolean} conditional
     * @param {Function} fn
     */
    execIfNot(conditional: boolean, fn: Function): void;
}
