export = SmtpDriver;
/**
 * Smtp driver is used to send email via stmp protocol.
 * It uses nodemailer internally and allows all the
 * config options from node mailer directly.
 *
 * @class SmtpDriver
 * @constructor
 */
declare class SmtpDriver {
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
