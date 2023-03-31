export = File;
/**
 * File class holds information and behavior related to a single file
 * accessed using `request.file` or `request.multipart.file`. It let
 * you stream or save user uploaded file to a given location.
 *
 * @class File
 * @constructor
 */
declare class File {
    constructor(readStream: any, options?: {});
    /**
     * Access to multipart stream
     *
     * @attribute stream
     *
     * @type {Stream}
     */
    stream: Stream;
    /**
     * File size
     *
     * @attribute size
     *
     * @type {Number}
     */
    size: number;
    /**
     * The file name uploaded the end user
     *
     * @attribute clientName
     *
     * @type {String}
     */
    clientName: string;
    /**
     * File extension
     *
     * @attribute extname
     *
     * @type {String}
     */
    extname: string;
    /**
     * The field name using which file was
     * uploaded
     *
     * @attribute fieldName
     *
     * @type {String}
     */
    fieldName: string;
    /**
     * Upload file header
     *
     * @attribute headers
     *
     * @type {Object}
     */
    headers: Object;
    /**
     * File name after move
     *
     * @attribute fileName
     *
     * @type {String|Null}
     */
    fileName: string | null;
    /**
     * File tmp path after `moveToTmp` is
     * called.
     *
     * @attribute tmpPath
     *
     * @type {String|Null}
     */
    tmpPath: string | null;
    /**
     * Marked as ended when stream is consued
     *
     * @type {Boolean}
     */
    ended: boolean;
    /**
     * The file main type.
     *
     * @attribute type
     *
     * @type {String}
     */
    type: string;
    /**
     * The file subtype.
     *
     * @type {String}
     */
    subtype: string;
    /**
     * valid statuses are - pending, consumed, moved, error
     * Consumed is set when readable stream ends.
     *
     * @attribute status
     *
     * @type {String}
     */
    status: string;
    /**
     * private properties
     */
    _validateFn: () => void;
    _error: {};
    _writeFd: any;
    /**
     * Define a custom file validation function
     *
     * @method validateFn
     *
     * @param {Function} callback
     *
     * @chainable
     */
    validateFn(callback: Function): File;
    /**
     * Run the validations on the file. This method will set the errors
     * on the file instance, instead of returning them back.
     *
     * @method runValidations
     *
     * @void
     */
    runValidations(): Promise<void>;
    /**
     * Validates the file size and extensions before moving the
     * file using the `move` method.
     *
     * @method _validateFile
     *
     * @return {void}
     *
     * @private
     */
    private _validateFile;
    /**
     * Listen for required events.
     *
     * @method _bindRequiredListeners
     *
     * @return {void}
     *
     * @private
     */
    private _bindRequiredListeners;
    /**
     * Streams files to a given location. Also makes sure
     * to remove opened file when readable stream throws
     * error and will also close opened streams
     *
     * @method _streamFile
     *
     * @param  {String}    location
     * @param  {Number}    [limit = 0]
     *
     * @return {Promise}
     *
     * @private
     */
    private _streamFile;
    /**
     * Pushes an error to the errors array and also
     * set the file status to `error`.
     *
     * @method setError
     *
     * @param  {String}   message
     * @param  {String}   type
     *
     * @return {void}
     */
    setError(message: string, type: string): void;
    /**
     * Set validation options on the file instance
     *
     * @method setOptions
     *
     * @param  {Object}   options
     *
     * @chainable
     */
    setOptions(options: Object): File;
    validationOptions: Object | undefined;
    /**
     * Set a custom validate function. It will be called before
     * the move operation
     *
     * @method validate
     *
     * @param  {Function} callback
     *
     * @chainable
     */
    validate(callback: Function): void;
    /**
     * Read the file into buffer.
     *
     * @method read
     *
     * @return {Promise}
     */
    read(): Promise<any>;
    /**
     * Moves file to the `tmp` directory. After this all
     * file descriptors are closed and stream cannot be
     * used any more.
     *
     * @method moveToTmp
     *
     * @package {Function} tmpNameFn
     *
     * @return {Promise}
     */
    moveToTmp(tmpNameFn: any): Promise<any>;
    /**
     * Moves file from tmp directory to the user
     * defined location.
     *
     * @method move
     *
     * @param  {String} location
     * @param  {Object} options
     *
     * @return {Promise}
     */
    move(location: string, options?: Object): Promise<any>;
    _location: string | undefined;
    /**
     * Returns the error if any
     *
     * @method errors
     *
     * @return {Array}
     */
    error(): any[];
    /**
     * Returns a boolean indicating whether
     * file has been moved or not
     *
     * @method moved
     *
     * @return {Boolean}
     */
    moved(): boolean;
    /**
     * Returns JSON representation of the file
     *
     * @method toJSON
     *
     * @return {Object}
     */
    toJSON(): Object;
}
