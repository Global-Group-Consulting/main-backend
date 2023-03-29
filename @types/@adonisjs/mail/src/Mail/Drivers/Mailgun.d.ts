export = MailGun;
declare class MailGun {
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
declare namespace MailGun {
    export { MailGunTransporter as Transport };
}
declare class MailGunTransporter {
    constructor(config: any);
    config: any;
    _acceptanceMessages: string[];
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
     * The mailgun endpoint
     *
     * @attribute endpoint
     *
     * @return {String}
     */
    get endpoint(): string;
    /**
     * The auth header value to be sent along
     * as header
     *
     * @attribute authHeader
     *
     * @return {String}
     */
    get authHeader(): string;
    /**
     * Formats a single recipient details into mailgun formatted
     * string
     *
     * @method _getRecipient
     *
     * @param  {Object|String}      recipient
     *
     * @return {String}
     *
     * @private
     */
    private _getRecipient;
    /**
     * Returns list of comma seperated receipents
     *
     * @method _getRecipients
     *
     * @param  {Object}       mail
     *
     * @return {String}
     *
     * @private
     */
    private _getRecipients;
    /**
     * Returns extras object by merging runtime config
     * with static config
     *
     * @method _getExtras
     *
     * @param  {Object|Null}   extras
     *
     * @return {Object}
     *
     * @private
     */
    private _getExtras;
    /**
     * Format the response message into standard output
     *
     * @method _formatSuccess
     *
     * @param  {Object}       response
     *
     * @return {Object}
     *
     * @private
     */
    private _formatSuccess;
    /**
     * Send email from transport
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
