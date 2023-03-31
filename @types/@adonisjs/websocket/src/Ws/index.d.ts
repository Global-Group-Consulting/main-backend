export = Ws;
/**
 * The websocket server is a wrapper over `ws` node library and
 * written for AdonisJs specifically.
 *
 * @class Ws
 *
 * @package {Config} Config - Reference of Config provider
 */
declare class Ws {
    constructor(Config: any);
    _options: any;
    /**
     * These options are passed directly to the `Websocket.Server` constructor
     *
     * @type {Object}
     */
    _serverOptions: Object;
    /**
     * The function to be called on connection
     * handshake
     *
     * @type {Function}
     */
    _handshakeFn: Function;
    /**
     * Reference to actual websocket server. It will
     * be set when `listen` method is called.
     *
     * @type {Websocket.Server}
     */
    _wsServer: Websocket.Server;
    /**
     * Encoder to be used for encoding the messages
     *
     * @type {Encoders}
     */
    _encoder: Encoders;
    /**
     * Tracking all the connections, this is required to play
     * ping/pong
     *
     * @type {Set}
     */
    _connections: Set<any>;
    /**
     * The timer initiated for monitoring connections
     * and terminating them if they are dead.
     *
     * @type {Timer}
     */
    _heartBeatTimer: Timer;
    /**
     * Verifies the handshake of a new connection.
     *
     * @method _verifyClient
     *
     * @param  {Object}      info
     * @param  {Function}      ack
     *
     * @return {void}
     *
     * @private
     */
    private _verifyClient;
    /**
     * The heart bear timer is required to monitor the health
     * of connections.
     *
     * Server will create only one timer for all the connections.
     *
     * @method _registerTimer
     *
     * @return {void}
     *
     * @private
     */
    private _registerTimer;
    /**
     * Clearing the timer when server closes
     *
     * @method _clearTimer
     *
     * @return {void}
     *
     * @private
     */
    private _clearTimer;
    /**
     * Bind a single function to validate the handshakes
     *
     * @method onHandshake
     *
     * @param  {Function}  fn
     *
     * @chainable
     */
    onHandshake(fn: Function): Ws;
    /**
     * Register a new channel to accept topic subscriptions
     *
     * @method channel
     *
     * @param  {...Spread} args
     *
     * @return {Channel}
     */
    channel(...args: Spread[]): Channel;
    /**
     * Returns channel instance for a given channel
     *
     * @method getChannel
     *
     * @param  {String}   name
     *
     * @return {Channel}
     */
    getChannel(name: string): Channel;
    /**
     * Handle a new connection
     *
     * @method handle
     *
     * @param  {Object} ws
     * @param  {Object} req
     *
     * @return {void}
     */
    handle(ws: Object, req: Object): void;
    /**
     * Start the websocket server
     *
     * @method listen
     *
     * @param  {Http.Server} server
     *
     * @return {void}
     */
    listen(server: Http.Server): void;
    /**
     * Closes the websocket server
     *
     * @method close
     *
     * @return {void}
     */
    close(): void;
    /**
     * Register an array of global middleware
     *
     * @method registerGlobal
     *
     * @param  {Array}       list
     *
     * @chainable
     *
     * @example
     * ```js
     * Ws.registerGlobal([
     *   'Adonis/Middleware/AuthInit'
     * ])
     * ```
     */
    registerGlobal(list: any[]): Ws;
    /**
     * Register a list of named middleware
     *
     * @method registerNamed
     *
     * @param  {Object}      list
     *
     * @chainable
     *
     * ```js
     * Ws.registerNamed({
     *   auth: 'Adonis/Middleware/Auth'
     * })
     * ```
     */
    registerNamed(list: Object): Ws;
}
