export = BodyParser;
/**
 * @module Adonis
 * @submodule bodyparser
 */
/**
 * BodyParser class is a global middleware attached to Adonis
 * HTTP server to parse and read request body. It has out
 * of the box support for.
 *
 * 1. JSON API, JSON Patch and CSV reports.
 * 2. Raw data
 * 3. Url encoded forms
 * 4. Multipart form data.
 *
 * Also it allows lazily streaming multipart payload.
 *
 * **Namespace**: `Adonis/Middleware/BodyParser` <br />
 * **Singleton**: No <br />
 * **Alias**: None
 *
 * @class BodyParser
 * @constructor
 */
declare class BodyParser {
    constructor(Config: any);
    /**
     * Giving preference to types from the user config over the
     * default config, since user can defined empty arrays as
     * part of ignoring body parsing, which will be overridden
     * otherwise by the merge method.
     */
    config: any;
    files: FormFields;
    fields: FormFields;
    /**
     * The JSON types to be used for identifying the JSON request.
     * The values are defined in `config/bodyParser.js` file
     * under `json` object.
     *
     * @attribute jsonTypes
     *
     * @type {Array}
     */
    get jsonTypes(): any[];
    /**
     * Form types to be used for identifying the form request.
     * The values are defined in `config/bodyParser.js` file
     * under `form` object.
     *
     * @attribute formTypes
     *
     * @type {Array}
     */
    get formTypes(): any[];
    /**
     * Raw types to be used for identifying the raw request.
     * The values are defined in `config/bodyParser.js`
     * file under `raw` object.
     *
     * @attribute rawTypes
     *
     * @type {Array}
     */
    get rawTypes(): any[];
    /**
     * Files types to be used for identifying the multipart types.
     * The values are defined in `config/bodyParser.js` file
     * under `files` object.
     *
     * @attribute filesTypes
     *
     * @type {Array}
     */
    get filesTypes(): any[];
    /**
     * Parses the JSON body when `Content-Type` is set to
     * one of the available `this.jsonTypes`.
     *
     * @method _parseJSON
     *
     * @param  {Object}   req
     *
     * @return {Object}
     *
     * @private
     */
    private _parseJSON;
    /**
     * Parses the form body when `Content-type` is set to
     * one of the available `this.formTypes`.
     *
     * @method _parseForm
     *
     * @param  {Object}   req
     *
     * @return {Object}
     *
     * @private
     */
    private _parseForm;
    /**
     * Parses the raw body when `Content-type` is set to
     * one of the available `this.rawTypes`.
     *
     * @method _parseRaw
     *
     * @param  {Object}  req
     *
     * @return {Object}
     *
     * @private
     */
    private _parseRaw;
    /**
     * Returns a boolean indicating whether request is
     * of a given type. Also makes sure that user
     * wants to process the given type.
     *
     * @method _isType
     *
     * @param  {Object}  request
     * @param  {Array}  types
     *
     * @return {Boolean}
     *
     * @private
     */
    private _isType;
    /**
     * Returns a boolean indicating whether or not
     * the files should be autoProcessed based
     * on certain conditions
     *
     * @method _shouldBeProcessed
     *
     * @param {Object} request
     *
     * @return {Boolean}
     *
     * @private
     */
    private _shouldBeProcessed;
    /**
     * Method called by Adonis middleware stack. It will read
     * the request body as per the config defined inside
     * `config/bodyParser.js` file. It will set following
     * private properties on the request object.
     *
     * 1. _body - The request body ( JSON or Url endcoded )
     * 2. _files - Uploaded files
     * 3. _raw - The request raw body.
     *
     * @method handle
     *
     * @param  {Object}   options.request
     * @param  {Function} next
     *
     * @return {void}
     */
    handle({ request }: Object, next: Function): void;
}
import FormFields = require("../FormFields");
