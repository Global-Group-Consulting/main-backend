export = SparkPost;
/**
 * Spark post driver for adonis mail
 *
 * @class SparkPost
 * @constructor
 */
declare class SparkPost {
    /**
     * This method is called by mail manager automatically
     * and passes the config object
     *
     * @method setConfig
     *
     * @param  {Object}  config
     */
    setConfig(config: Object): void;
    transporter: any;
    /**
     * Send a message via message object
     *
     * @method send
     * @async
     *
     * @param  {Object} message
     *
     * @return {Object}
     *
     * @throws {Error} If promise rejects
     */
    send(message: Object): Object;
}
declare namespace SparkPost {
    export { SparkPostTransporter as Transport };
}
/**
 * The core transportor node-mailer
 *
 * @class SparkPostTransporter
 * @constructor
 */
declare class SparkPostTransporter {
    constructor(config: any);
    config: any;
    /**
     * The api endpoint for sparkpost
     *
     * @attribute endpoint
     *
     * @return {String}
     */
    get endpoint(): string;
    /**
     * Transport name
     *
     * @attribute name
     *
     * @return {String}
     */
    get name(): string;
    /**
     * Transport version
     *
     * @attribute version
     *
     * @return {String}
     */
    get version(): string;
    /**
     * Validations to make sure to config is complete
     *
     * @method _runValidations
     *
     * @return {String}
     *
     * @private
     */
    private _runValidations;
    /**
     * Returns the name and email formatted as spark
     * recipient
     *
     * @method _getReceipent
     *
     * @param  {String|Object}      item
     *
     * @return {Object}
     *
     * @private
     */
    private _getRecipient;
    /**
     * Returns an array of recipients formatted
     * as per spark post standard.
     *
     * @method _getRecipients
     *
     * @param  {Object}       mail
     *
     * @return {Array}
     *
     * @private
     */
    private _getRecipients;
    /**
     * Format success message
     *
     * @method _formatSuccess
     *
     * @param  {Object}       response
     *
     * @return {String}
     *
     * @private
     */
    private _formatSuccess;
    /**
     * Returns options to be sent with email
     *
     * @method _getOptions
     *
     * @param  {Object}    extras
     *
     * @return {Object|Null}
     *
     * @private
     */
    private _getOptions;
    /**
     * Returns the campaign id for the email
     *
     * @method _getCampaignId
     *
     * @param  {Object}       extras
     *
     * @return {String|null}
     *
     * @private
     */
    private _getCampaignId;
    /**
     * Sending email from transport
     *
     * @method send
     *
     * @param  {Object}   mail
     * @param  {Function} callback
     *
     * @return {void}
     */
    send(mail: Object, callback: Function): void;
}
