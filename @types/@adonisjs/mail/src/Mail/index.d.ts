export = Mail;
/**
 * The mail class is used to grab an instance of
 * sender for a given connection and driver.
 *
 * @namespace Adonis/Addons/Mail
 * @alias Mail
 *
 * @class Mail
 * @constructor
 */
declare class Mail {
    constructor(Config: any, View: any);
    Config: any;
    View: any;
    _sendersPool: {};
    _fake: import("./Fake") | null;
    /**
     * Returns an instance of a mail connection. Also this
     * method will cache the connection for re-usability.
     *
     * @method connection
     *
     * @param  {String}   name
     *
     * @return {Object}
     */
    connection(name: string): Object;
    /**
     * Setup a faker object, which will be used over
     * using the actual emailer methods
     *
     * @method fake
     *
     * @return {void}
     */
    fake(): void;
    /**
     * Restore faker object
     *
     * @method restore
     *
     * @return {void}
     */
    restore(): void;
}
