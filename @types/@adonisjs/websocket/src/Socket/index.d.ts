export = Socket;
/**
 * Socket is instance of a subscription for a given topic.
 * Socket will always have access to the channel and
 * it's parent connection.
 *
 * @class Socket
 *
 * @param {String}  topic
 * @param {Connect} connection
 */
declare class Socket {
    constructor(topic: any, connection: any);
    channel: any;
    emitter: any;
    /**
     * Associates the channel to the socket
     *
     * @method associateChannel
     *
     * @param  {Channel}         channel
     *
     * @return {void}
     */
    associateChannel(channel: Channel): void;
    /**
     * Bind a listener
     *
     * @method on
     *
     * @param  {...Spread} args
     *
     * @return {void}
     */
    on(...args: Spread[]): void;
    /**
     * Bind a listener for one time only
     *
     * @method once
     *
     * @param  {...Spread} args
     *
     * @return {void}
     */
    once(...args: Spread[]): void;
    /**
     * Remove listener
     *
     * @method off
     *
     * @param  {...Spread} args
     *
     * @return {void}
     */
    off(...args: Spread[]): void;
    /**
     * Emit message to the client
     *
     * @method emit
     *
     * @param  {String}   event
     * @param  {Object}   data
     * @param  {Function} [ack]
     *
     * @return {void}
     */
    emit(event: string, data: Object, ack?: Function | undefined): void;
    /**
     * Broadcast event to everyone except the current socket.
     *
     * @method broadcast
     *
     * @param  {String}   event
     * @param  {Mixed}    data
     *
     * @return {void}
     */
    broadcast(event: string, data: Mixed): void;
    /**
     * Broadcasts the message to everyone who has joined the
     * current topic.
     *
     * @method broadcastToAll
     *
     * @param  {String}       event
     * @param  {Mixed}       data
     *
     * @return {void}
     */
    broadcastToAll(event: string, data: Mixed): void;
    /**
     * Emit event to selected socket ids
     *
     * @method emitTo
     *
     * @param  {String} event
     * @param  {Mixed}  data
     * @param  {Array}  ids
     *
     * @return {void}
     */
    emitTo(event: string, data: Mixed, ids: any[]): void;
    /**
     * Invoked when internal connection gets a TCP error
     *
     * @method serverError
     *
     * @param  {Number}    code
     * @param  {String}    reason
     *
     * @return {void}
     */
    serverError(code: number, reason: string): void;
    /**
     * A new message received
     *
     * @method serverMessage
     *
     * @param  {String}      options.event
     * @param  {Mixed}       options.data
     *
     * @return {void}
     */
    serverMessage({ event, data }: string): void;
    /**
     * Close the subscription, when client asks for it
     * or when server connection closes
     *
     * @method serverClose
     *
     * @return {Promise}
     */
    serverClose(): Promise<any>;
    /**
     * Close the subscription manually
     *
     * @method close
     *
     * @return {Promise}
     */
    close(): Promise<any>;
}
