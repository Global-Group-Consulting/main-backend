export = FileJar;
/**
 * FileJar is store to keep multiple files of same nature. For
 * uploading multiple files will be bundled as `Jar` and you
 * can call methods on this class to perform bulk operations.
 *
 * @class FileJar
 * @constructor
 */
declare class FileJar {
    constructor(files?: any[]);
    _files: any[];
    /**
     * An array of files inside the file jar
     *
     * @method files
     *
     * @return {Array<File>}
     */
    get files(): File[];
    /**
     * Add a new file to the store
     *
     * @method track
     *
     * @param  {File} file
     *
     * @return {void}
     */
    track(file: File): void;
    /**
     * Return all files inside the Jar. Also this method
     * will `toJSON` on each file instance before
     * returning.
     *
     * To get an array of file instances, call `fileJar.files()`
     *
     * @method all
     *
     * @return {Array}
     */
    all(): any[];
    /**
     * Returns an array of files that have been moved successfully.
     * `file.toJSON()` is called before returing file.
     *
     * @method movedList
     *
     * @return {Array}
     */
    movedList(): any[];
    /**
     * Returns a boolean indicating whether all files have been moved
     * or not.
     *
     * @method movedAll
     *
     * @return {Boolean}
     */
    movedAll(): boolean;
    /**
     * Moves all files to the given location parallely
     *
     * @method moveAll
     *
     * @param  {String} location
     * @param  {Function} callback
     *
     * @return {Promise}
     *
     * @example
     * ```js
     * fileJar.moveAll(Helpers.tmpPath('uploads'), function (file) {
     *   return { name: new Date().getTime() }
     * })
     * ```
     */
    moveAll(location: string, callback: Function): Promise<any>;
    /**
     * Run validations on all the files inside the File Jar
     *
     * @method runValidations
     *
     * @return {void}
     */
    runValidations(): void;
    /**
     * Returns an array errors occured during file move.
     *
     * @method errors
     *
     * @return {Array}
     */
    errors(): any[];
}
