export = Message;
/**
 * The message builder is used to construct a message
 * by chaining different methods.
 *
 * The instance of this class is passed to `Mail.send`
 * callback function.
 *
 * @class Message
 * @constructor
 */
declare class Message {
    mailerMessage: {};
    /**
     * Parse and set address object/array on
     * the address key
     *
     * @method _setAddress
     *
     * @param  {String}    key
     * @param  {String|Array}    address
     * @param  {String}    [name]
     *
     * @private
     */
    private _setAddress;
    /**
     * Set `from` on the email.
     *
     * @method from
     *
     * @param  {String|Array} address
     * @param  {String} [name]
     *
     * @chainable
     *
     * @example
     * ```
     *  // just email
     * message.from('foo@bar.com')
     *
     *  // name + email
     * message.from('foo@bar.com', 'Foo')
     *
     * // Address object
     * message.from([{ address: 'foo@bar.com', name: 'Foo' }])
     * ```
     */
    from(address: string | any[], name?: string | undefined): Message;
    /**
     * Set `to` on the email.
     *
     * @method to
     *
     * @param  {String|Array} address
     * @param  {String} [name]
     *
     * @chainable
     *
     * @example
     * ```
     *  // just email
     * message.to('foo@bar.com')
     *
     *  // name + email
     * message.to('foo@bar.com', 'Foo')
     *
     * // Address object
     * message.to([{ address: 'foo@bar.com', name: 'Foo' }])
     * ```
     */
    to(address: string | any[], name?: string | undefined): Message;
    /**
     * Set `cc` on the email.
     *
     * @method cc
     *
     * @param  {String|Array} address
     * @param  {String} [name]
     *
     * @chainable
     *
     * @example
     * ```
     *  // just email
     * message.cc('foo@bar.com')
     *
     *  // name + email
     * message.cc('foo@bar.com', 'Foo')
     *
     * // Address object
     * message.cc([{ address: 'foo@bar.com', name: 'Foo' }])
     * ```
     */
    cc(address: string | any[], name?: string | undefined): Message;
    /**
     * Set `bcc` on the email.
     *
     * @method bcc
     *
     * @param  {String|Array} address
     * @param  {String} [name]
     *
     * @chainable
     *
     * @example
     * ```
     *  // just email
     * message.bcc('foo@bar.com')
     *
     *  // name + email
     * message.bcc('foo@bar.com', 'Foo')
     *
     * // Address object
     * message.bcc([{ address: 'foo@bar.com', name: 'Foo' }])
     * ```
     */
    bcc(address: string | any[], name?: string | undefined): Message;
    /**
     * Set `sender` on the email.
     *
     * @method sender
     *
     * @param  {String|Array} address
     * @param  {String} [name]
     *
     * @chainable
     *
     * @example
     * ```
     *  // just email
     * message.sender('foo@bar.com')
     *
     *  // name + email
     * message.sender('foo@bar.com', 'Foo')
     *
     * // Address object
     * message.sender([{ address: 'foo@bar.com', name: 'Foo' }])
     * ```
     */
    sender(address: string | any[], name?: string | undefined): Message;
    /**
     * Set `replyTo` on the email.
     *
     * @method replyTo
     *
     * @param  {String|Array} address
     * @param  {String} [name]
     *
     * @chainable
     *
     * @example
     * ```
     *  // just email
     * message.replyTo('foo@bar.com')
     *
     *  // name + email
     * message.replyTo('foo@bar.com', 'Foo')
     *
     * // Address object
     * message.replyTo([{ address: 'foo@bar.com', name: 'Foo' }])
     * ```
     */
    replyTo(address: string | any[], name?: string | undefined): Message;
    /**
     * Set in reply to message id
     *
     * @method inReplyTo
     *
     * @param  {String}  messageId
     *
     * @chainable
     *
     * ```js
     * message.inReplyTo('101002001')
     * ```
     */
    inReplyTo(messageId: string): Message;
    /**
     * Set subject for the emaul
     *
     * @method subject
     *
     * @param  {String} subject
     *
     * @chainable
     */
    subject(subject: string): Message;
    /**
     * Set email text body
     *
     * @method text
     *
     * @param  {String} text
     *
     * @chainable
     */
    text(text: string): Message;
    /**
     * Set email html body
     *
     * @method html
     *
     * @param  {String} html
     *
     * @chainable
     */
    html(html: string): Message;
    /**
     * Set html for apple watch
     *
     * @method watchHtml
     *
     * @param  {String}  html
     *
     * @chainable
     */
    watchHtml(html: string): Message;
    /**
     * Add a new attachment to the mail
     *
     * @method attach
     *
     * @param  {String} content
     * @param  {Object} [options]
     *
     * @chainable
     *
     * @example
     * ```js
     * message.attach('absolute/path/to/file')
     * message.attach('absolute/path/to/file', { contentTpe: 'plain/text' })
     * ```
     */
    attach(filePath: any, options?: Object | undefined): Message;
    /**
     * Attach raw data as attachment with a custom file name
     *
     * @method attachData
     *
     * @param  {String|Buffer|Stream}   content
     * @param  {String}                 filename
     * @param  {Object}                 [options]
     *
     * @chainable
     *
     * @example
     * ```js
     * message.attachData('hello', 'hello.txt')
     * message.attachData(new Buffer('hello'), 'hello.txt')
     * message.attachData(fs.createReadStream('hello.txt'), 'hello.txt')
     * ```
     */
    attachData(content: string | Buffer | Stream, filename: string, options?: Object | undefined): Message;
    /**
     * Set alternative content for the email.
     *
     * @method alternative
     *
     * @param  {String} content
     * @param  {Object} [options]
     *
     * @chainable
     *
     * @example
     * ```js
     * message.alternative('**Hello**', { contentType: 'text/x-web-markdown' })
     * ```
     */
    alternative(content: string, options?: Object | undefined): Message;
    /**
     * Embed image to the content. This is done
     * via cid.
     *
     * @method embed
     *
     * @param  {String} filePath
     * @param  {String} cid   - Must be unique to single email
     * @param  {Object} [options]
     *
     * @chainable
     *
     * @example
     * ```
     * message.embed('logo.png', 'logo')
     * // inside html
     * <img src="cid:logo" />
     * ```
     */
    embed(filePath: string, cid: string, options?: Object | undefined): Message;
    /**
     * Set extras to be sent to the current driver in
     * use. It is the responsibility of the driver
     * to parse and use the extras
     *
     * @method driverExtras
     *
     * @param  {Object}     extras
     *
     * @chainable
     */
    driverExtras(extras: Object): Message;
    /**
     * Returns nodemailer compatable message
     * object
     *
     * @method toJSON
     *
     * @return {Object}
     */
    toJSON(): Object;
}
