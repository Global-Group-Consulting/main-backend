export = Connection;
/**
 * Connection is an instance of a single TCP connection. This class decodes the
 * packets and use them to run operations like. `JOIN/LEAVE A TOPIC`, `EMIT EVENT`
 * and so on.
 *
 * 1. Each connection is given a unique id
 * 2. The connection will also maintain a list of subscriptions for a connection
 *
 * @class Connection
 *
 * @param {Object} ws       The underlying socket connection
 * @param {Object} req      Request object
 * @param {Object} encoder  Encoder to be used for encoding/decoding messages
 */
declare class Connection {
    constructor(ws: any, req: any, encoder: any);
    ws: any;
    req: any;
    /**
     * Each connection must have a unique id. The `cuid` keeps
     * it unique across the cluster
     *
     * @type {String}
     */
    id: string;
    /**
     * The encoder is used to encode and decode packets. Note this is
     * not encryption or decryption, encoders are used to translate
     * data-types into raw string.
     *
     * @type {Object}
     */
    _encoder: Object;
    /**
     * A connection can have multiple subscriptions for a given channel.
     *
     * @type {Map}
     */
    _subscriptions: Map<any, any>;
    /**
     * An array of subscriptions queue, we let connection join
     * topics one by one and not in parallel.
     *
     * This also helps in avoiding duplicate subscriptions
     * to the same topic.
     *
     * @type {Array}
     */
    _subscriptionsQueue: any[];
    /**
     * A flag to tell whether the queue is in process or not.
     *
     * @type {Boolean}
     */
    _processingQueue: boolean;
    /**
     * Added as a listener to `onclose` event of the subscription.
     */
    deleteSubscription: ({ topic }: {
        topic: any;
    }) => void;
    /**
     * The number of times ping check has been done. This
     * counter will reset, anytime client will ping
     * or send any sort of frames.
     *
     * @type {Number}
     */
    pingElapsed: number;
    /**
     * Returns the ready state of the underlying
     * ws connection
     *
     * @method readyState
     *
     * @return {Number}
     */
    get readyState(): number;
    /**
     * Notifies about the drop packets. This method will log
     * them to the debug output
     *
     * @method _notifyPacketDropped
     *
     * @param  {Function}           fn
     * @param  {String}             reason
     *
     * @return {void}
     *
     * @private
     */
    private _notifyPacketDropped;
    /**
     * Opens the packet by decoding it.
     *
     * @method _openPacket
     *
     * @param  {Buffer}    packet
     *
     * @return {Promise}
     *
     * @private
     */
    private _openPacket;
    /**
     * Invoked everytime a new message is received. This method will
     * open the packet and handles it based upon the packet type.
     *
     * Invalid packets are dropped.
     *
     * @method _onMessage
     *
     * @param  {Object}   packet
     *
     * @return {void}
     *
     * @private
     */
    private _onMessage;
    /**
     * Handles the message packet, this method is invoked when
     * packet is valid and must be handled.
     *
     * @method _handleMessage
     *
     * @param  {Object}       packet
     *
     * @return {void}
     *
     * @private
     */
    private _handleMessage;
    /**
     * Processes the event by ensuring the packet is valid and there
     * is a subscription for the given topic.
     *
     * @method _processEvent
     *
     * @param  {Object}      packet
     *
     * @return {void}
     */
    _processEvent(packet: Object): void;
    /**
     * Process the subscription packets, one at a time in
     * sequence.
     *
     * @method _getSubscriptionHandle
     *
     * @param  {Object}             packet
     *
     * @return {void}
     *
     * @private
     */
    private _getSubscriptionHandle;
    /**
     * Advances the join queue until there are join
     * packets in the queue
     *
     * @method _advanceQueue
     *
     * @return {void}
     *
     * @private
     */
    private _advanceQueue;
    /**
     * Joins the topic. The consumer of this function should make sure
     * that the packet type is correct when sending to this function.
     *
     * @method _joinTopic
     *
     * @param  {Object}   packet
     *
     * @return {void}
     *
     * @private
     */
    private _joinTopic;
    /**
     * Leaves the topic by removing subscriptions
     *
     * @method _leaveTopic
     *
     * @param  {Object}    packet
     *
     * @return {void}
     *
     * @private
     */
    private _leaveTopic;
    /**
     * Invoked when connection receives an error
     *
     * @method _onError
     *
     * @return {void}
     *
     * @private
     */
    private _onError;
    /**
     * Invoked when TCP connection is closed. We will have to close
     * all the underlying subscriptions too.
     *
     * @method _onClose
     *
     * @return {void}
     *
     * @private
     */
    private _onClose;
    /**
     * Add a new subscription socket for a given topic
     *
     * @method addSubscription
     *
     * @param  {String}        topic
     * @param  {Socket}        subscription
     *
     * @returns {void}
     */
    addSubscription(topic: string, subscription: Socket): void;
    /**
     * Returns a boolean whether there is a socket
     * for a given topic or not.
     *
     * @method hasSubscription
     *
     * @param  {String}  topic
     *
     * @return {Boolean}
     */
    hasSubscription(topic: string): boolean;
    /**
     * Returns the socket instance for a given topic
     * for a given channel
     *
     * @method getSubscription
     *
     * @param  {Object}  topic
     *
     * @return {Socket}
     */
    getSubscription(topic: Object): Socket;
    /**
     * Closes the subscription for a given topic on connection
     *
     * @method closeSubscription
     *
     * @param  {Object}          subscription
     *
     * @return {void}
     */
    closeSubscription(subscription: Object): void;
    /**
     * Encodes the packet to be sent over the wire
     *
     * @method encodePacket
     *
     * @param  {Object}     packet
     * @param  {Function}   cb
     *
     * @return {void}
     */
    encodePacket(packet: Object, cb: Function): void;
    /**
     * Sends the packet to the underlying connection by encoding
     * it.
     *
     * If socket connection is closed, the packet will be dropped
     *
     * @method sendPacket
     *
     * @param  {Object}   packet
     * @param  {Object}   [options]
     * @param  {Function} ack
     *
     * @return {void}
     */
    sendPacket(packet: Object, options?: Object | undefined, ack: Function): void;
    /**
     * Writes to the underlying socket. Also this method
     * makes sure that the connection is open
     *
     * @method write
     *
     * @param  {String}   payload
     * @param  {Object}   options
     * @param  {Function} [ack]
     *
     * @return {void}
     */
    write(payload: string, options: Object, ack?: Function | undefined): void;
    /**
     * Sends the open packet on the connection as soon as
     * the connection has been made
     *
     * @method sendOpenPacket
     *
     * @package {Object} options
     *
     * @return {void}
     */
    sendOpenPacket(options: any): void;
    /**
     * Sends the leave packet, when the subscription to a channel
     * has been closed from the server.
     *
     * @method sendLeavePacket
     *
     * @param {String} topic
     *
     * @return {void}
     */
    sendLeavePacket(topic: string): void;
    /**
     * Makes the event packet from the topic and the
     * body
     *
     * @method makeEventPacket
     *
     * @param  {String}        topic
     * @param  {String}        event
     * @param  {Mixed}         data
     *
     * @return {Object}
     */
    makeEventPacket(topic: string, event: string, data: Mixed): Object;
    /**
     * Sends the event to the underlying connection
     *
     * @method sendEvent
     *
     * @param  {String}    topic
     * @param  {String}    event
     * @param  {Mixed}     data
     * @param  {Function}  [ack]
     *
     * @return {void}
     */
    sendEvent(topic: string, event: string, data: Mixed, ack?: Function | undefined): void;
    /**
     * Close the underlying ws connection. This method will
     * initiate a closing handshake.
     *
     * @method close
     *
     * @param  {Number} code
     * @param  {String} [reason]
     *
     * @return {void}
     */
    close(code: number, reason?: string | undefined): void;
    /**
     * Terminates the connection forcefully. This is called when client
     * doesn't ping the server.
     *
     * @method terminate
     *
     * @package {String} reason
     *
     * @return {void}
     */
    terminate(reason: any): void;
}
import Socket = require("../Socket");
