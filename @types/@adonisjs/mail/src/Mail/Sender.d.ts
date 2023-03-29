export = MailSender;
/**
 * This class sends the email using the defined driverInstance.
 * You can make use of the @ref('Message') class to build
 * the message via message builder.
 *
 * @class MailSender
 * @constructor
 */
declare class MailSender {
    constructor(driverInstance: any, viewInstance: any);
    _driverInstance: any;
    _viewInstance: any;
    /**
     * Parse the `views` array of string passed to
     * the `send` method and returns an object
     * of views for html, text and watch
     *
     * @method _parseViews
     *
     * @param  {String|Array}    views
     *
     * @return {Object}
     *
     * @private
     */
    private _parseViews;
    /**
     * Send the message using the defined driver. The
     * callback will receive the message builder
     * instance
     *
     * @method send
     * @async
     *
     * @param  {String|Array}  views
     * @param  {Object}        [data]
     * @param  {Function}      callback
     *
     * @return {Object}
     *
     * @example
     * ```js
     * await sender.send('welcome', {}, (message) => {
     *   message.from('foo@bar.com')
     * })
     *
     * await sender.send(['welcome', 'welcome.text', 'welcome.watch'], {}, (message) => {
     *   message.from('foo@bar.com')
     * })
     * ```
     *
     * @throws {Error} If promise fails
     */
    send(views: string | any[], data?: Object | undefined, callback: Function): Object;
    /**
     * Send email via raw text
     *
     * @method raw
     * @async
     *
     * @param  {String}   body
     * @param  {Function} callback
     *
     * @return {Object}
     *
     * @example
     * ```js
     * await sender.raw('Your security code is 301030', (message) => {
     *   message.from('foo@bar.com')
     * })
     * ```
     */
    raw(body: string, callback: Function): Object;
}
