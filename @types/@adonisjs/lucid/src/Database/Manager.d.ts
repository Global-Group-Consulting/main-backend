export = DatabaseManager;
/**
 * DatabaseManager is a layer on top of @ref('Database') class. It
 * manages a pool of different database connections and proxy all
 * Database methods, so that it's easier to work with them.
 *
 * ```js
 * const Database = use('Database')
 *
 * // making query on default connection
 * await Database.table('users')
 *
 * // making query on selected connection
 * await Database.connection('mysql').table('users')
 * ```
 *
 * @binding Adonis/Src/Database
 * @singleton
 * @alias Database
 * @group Database
 * @uses (['Adonis/Src/Config'])
 *
 * @class DatabaseManager
 */
declare class DatabaseManager {
    constructor(Config: any);
    Config: any;
    _connectionPools: {};
    /**
     * Creates a new database connection for the config defined inside
     * `config/database` file. You just need to pass the key name or don't
     * pass any name to use the default connection.
     *
     * Also this method will reuse and returns the existing connections.
     *
     * @method connection
     *
     * @param  {String}   [name = Config.get('database.connection')]
     *
     * @return {Database}
     *
     * @throws {missingDatabaseConnection} If connection is not defined in config file.
     */
    connection(name?: string | undefined): Database;
    /**
     * Close all or selected db connections and remove them from pool.
     *
     * Note always use this method to close database connection and
     * never use the direct instance of database, since that will
     * cause memory leaks.
     *
     * @method close
     *
     * @param {String|Array} [names = *]
     *
     * @return {void}
     *
     * @example
     * ```js
     * // WRONG
     * const Db = Database.connection('mysql')
     * Db.close()
     * ```
     *
     * ```js
     * // RIGHT
     * Database.close('mysql')
     * ```
     */
    close(names?: string | any[] | undefined): void;
}
import Database = require(".");
