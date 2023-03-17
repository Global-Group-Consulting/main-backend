export = Helpers;
/**
 * This class returns absolute path to commonly
 * used AdonisJs directories.
 *
 * @namespace Adonis/Src/Helpers
 * @alias Helpers
 * @singleton
 * @group Core
 *
 * @class Helpers
 * @constructor
 */
declare class Helpers {
    constructor(appRoot: any);
    _appRoot: any;
    /**
     * Returns path to the application root
     *
     * @method appRoot
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    appRoot(toFile?: string | undefined): string;
    /**
     * Returns path to the public directory or a
     * specific file to the public directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method publicPath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    publicPath(toFile?: string | undefined): string;
    /**
     * Returns path to the config directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method configPath
     *
     * @return {String}
     */
    configPath(...args: any[]): string;
    /**
     * Returns path to the resources directory or a
     * specific file to the resources directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method resourcesPath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    resourcesPath(toFile?: string | undefined): string;
    /**
     * Returns path to the views directory or a
     * specific file to the views directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method viewsPath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    viewsPath(toFile?: string | undefined): string;
    /**
     * Returns path to the database directory or a
     * specific file to the database directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method databasePath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    databasePath(toFile?: string | undefined): string;
    /**
     * Returns path to the migrations directory or a
     * specific file to the migrations directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method migrationsPath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    migrationsPath(toFile?: string | undefined): string;
    /**
     * Returns path to the seeds directory or a
     * specific file to the seeds directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method seedsPath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    seedsPath(toFile?: string | undefined): string;
    /**
     * Returns path to the tmp directory or a
     * specific file to the tmp directory.
     *
     * ## Note
     * This method does not check the existence of
     * file.
     *
     * @method tmpPath
     *
     * @param  {String}   [toFile = '']
     *
     * @return {String}
     */
    tmpPath(toFile?: string | undefined): string;
    /**
     * Promisify callback style functions
     *
     * @method promisify
     *
     * @param  {Function} fn
     * @param  {Object}   options
     *
     * @return {Promise}
     */
    promisify(fn: Function, options: Object): Promise<any>;
    /**
     * Tells whether the process has been started by
     * ace command.
     *
     * @method isAceCommand
     *
     * @return {Boolean}
     */
    isAceCommand(): boolean;
}
