export = Multipart;
/**
 * Multipart class does all the heavy lifting of processing multipart
 * data and allows lazy access to the uploaded files. Ideally this
 * class is used by the BodyParser middleware but if `autoProcess`
 * is set to false, you can use this class manually to read file
 * streams and process them.
 *
 * @class Multipart
 * @constructor
 */
declare class Multipart {
    constructor(request: any, disableJar?: boolean);
    req: any;
    /**
     * Storing which files has been accessed by the end-user. When
     * lazy is set to false, the object is ignored and all files
     * are processed.
     *
     * @type {Object}
     */
    _filesToAccess: Object;
    /**
     * The options and handler attached to a wildcard. Which
     * means all files inside the stream will be handled
     * by the wildcard unless specific handlers are
     * defined.
     *
     * @type {Object}
     */
    _wildcard: Object;
    /**
     * Options to be passed to multiparty
     *
     * @type {Object}
     */
    _multipartyOptions: Object;
    /**
     * The callback to be called to access fields
     *
     * @type {Function|Null}
     */
    _fieldsCallback: Function | null;
    jar: FileJar | undefined;
    _processedStream: boolean;
    /**
     * Multiparty will finish the stream when read stream
     * is consumed but at times clients needs more time
     * even when stream is consumed. In that case we
     * should make sure all promises are resolved
     * or rejected before moving forwards.
     *
     * @type {Object}
     */
    _pendingPromises: Object;
    /**
     * Executed for each part in stream. Returning
     * promise or consuming the stream will
     * advance the process.
     *
     * @method onPart
     *
     * @param  {Stream} part
     *
     * @return {Promise}
     */
    onPart(part: Stream): Promise<any>;
    /**
     * Process files by going over each part of the stream. Files
     * are ignored when there are no listeners listening for them.
     *
     * @method process
     *
     * @return {Promise}
     */
    process(): Promise<any>;
    /**
     * Add a listener to file. It is important to attach a callback and
     * handle the processing of the file. Also only one listener can
     * be added at a given point of time, since 2 parties processing
     * a single file doesn't make much sense.
     *
     * @method file
     *
     * @param  {String}   name
     * @param  {Object}   options
     * @param  {Function} callback
     *
     * @chainable
     */
    file(name: string, options: Object | undefined, callback: Function): Multipart;
    /**
     * Attach a listener to get fields name/value. Callback
     * will be executed for each field inside multipart
     * form/data.
     *
     * @method field
     *
     * @param  {Function} callback
     *
     * @chainable
     */
    field(callback: Function): Multipart;
}
import FileJar = require("./FileJar");
