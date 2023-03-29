export = EtherealDriver;
/**
 * Ethereal driver is used to run test emails
 *
 * @class EtherealDriver
 * @constructor
 */
declare class EtherealDriver {
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
    log: any;
    /**
     * Initiate transporter
     *
     * @method setTransporter
     *
     * @param  {String}       user
     * @param  {String}       pass
     */
    setTransporter(user: string, pass: string): void;
    /**
     * Creates a new transporter on fly
     *
     * @method createTransporter
     *
     * @return {String}
     */
    createTransporter(): string;
    /**
     * Sends email
     *
     * @method sendEmail
     *
     * @param  {Object}  message
     *
     * @return {Object}
     */
    sendEmail(message: Object): Object;
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
