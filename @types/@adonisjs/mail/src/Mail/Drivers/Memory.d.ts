export = MemoryDriver;
/**
 * Memory driver is used to get the message back as
 * an object over sending it to a real user.
 *
 * @class MemoryDriver
 * @constructor
 */
declare class MemoryDriver {
    /**
     * This method is called by mail manager automatically
     * and passes the config object
     *
     * @method setConfig
     */
    setConfig(): void;
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
