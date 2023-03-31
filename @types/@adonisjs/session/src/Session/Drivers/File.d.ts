export = File;
/**
 * Redis driver to save session values to the
 * redis store.
 *
 * @class File
 * @constructor
 */
declare class File {
    /**
     * Namespaces to inject
     *
     * @attribute inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Config: any, Helpers: any);
    _location: any;
    /**
     * Returns path to the session file
     *
     * @method _getFilePath
     *
     * @param  {String}     sessionId
     *
     * @return {String}
     *
     * @private
     */
    private _getFilePath;
    /**
     * Read values from the session file
     *
     * @param  {String} sessionId
     *
     * @method read
     * @async
     *
     * @return {Object}
     */
    read(sessionId: string): Object;
    /**
     * Write session values to file
     *
     * @method write
     * @async
     *
     * @param  {String} sessionId
     * @param  {Object} values
     *
     * @return {void}
     */
    write(sessionId: string, values: Object): void;
    /**
     * Update file last modified time
     *
     * @method touch
     * @async
     *
     * @param  {String} sessionId
     * @param  {Object} values
     *
     * @return {void}
     */
    touch(sessionId: string, values: Object): void;
}
