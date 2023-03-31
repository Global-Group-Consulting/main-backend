export = FakeMail;
/**
 * Fake mail is used to send fake emails
 * and run assertions.
 *
 * @class FakeMail
 * @constructor
 */
declare class FakeMail {
    constructor(Config: any, View: any);
    Config: any;
    View: any;
    sender: import("./Sender");
    _mails: any[];
    /**
     * Returns reference to this, required to be API
     * compatable
     *
     * @method connection
     *
     * @return {FakeMail}
     */
    connection(): FakeMail;
    /**
     * Returns the last sent email.
     *
     * @method recent
     *
     * @return {Object}
     */
    recent(): Object;
    /**
     * Returns the last sent email and removes it from
     * the array as well
     *
     * @method pullRecent
     *
     * @return {Object}
     */
    pullRecent(): Object;
    /**
     * Returns a copy of all the emails
     *
     * @method all
     *
     * @return {Array}
     */
    all(): any[];
    /**
     * Clear all stored emails
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
}
