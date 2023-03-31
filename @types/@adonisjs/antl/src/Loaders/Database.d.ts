export = DatabaseLoader;
/**
 * Database loader, pulls the messages from the database
 *
 * @class DatabaseLoader
 * @constructor
 *
 * @param {Database} Database
 */
declare class DatabaseLoader {
    /**
     * Ioc Container injections
     *
     * @method inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Database: any);
    Database: any;
    /**
     * Implemented since it's a required method for
     * a loader.
     *
     * @method setConfig
     */
    setConfig(): void;
    /**
     * Loads locales from the `locales` table and returns
     * it back as a nested object, as required by antl.
     *
     * @method load
     *
     * @return {Object}
     */
    load(): Object;
    /**
     * @alias load
     */
    reload(): Object;
}
