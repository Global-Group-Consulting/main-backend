export = Channel;
/**
 * Channel class gives a simple way to divide the application
 * level concerns by maintaing a single TCP connection.
 *
 * @class Channel
 *
 * @param {String} name         Unique channel name
 * @param {Function} onConnect  Function to be invoked when a socket joins a Channel
 */
declare class Channel {
    constructor(name: any, onConnect: any);
    name: any;
    _onConnect: any;
    /**
     * If channel controller is an ES6 class, then we let users
     * define listeners using a convention by prefixing `on`
     * in front of their methods.
     *
     * Instead of re-findings these listeners again and again on
     * the class prototype, we just pull them for once.
     *
     * @type {Array}
     */
    _channelControllerListeners: any[];
    /**
     * All of the channel subscriptions are grouped
     * together as per their topics.
     *
     * @example
     * this.subscriptions.set('chat:watercooler', new Set())
     * this.subscriptions.set('chat:general', new Set())
     *
     * @type {Map}
     */
    subscriptions: Map<any, any>;
    /**
     * Named middleware defined on the channel
     */
    _middleware: any[];
    /**
     * The method attached as an event listener to each
     * subscription.
     */
    deleteSubscription: (subscription: any) => void;
    /**
     * Validate the new instance arguments to make sure we
     * can instantiate the channel.
     *
     * @method _validateArguments
     *
     * @param  {String}           name
     * @param  {Function}           onConnect
     *
     * @return {void}
     *
     * @throws {InvalidArgumentException} If arguments are incorrect
     *
     * @private
     */
    private _validateArguments;
    /**
     * Executes the middleware stack
     *
     * @method _executeMiddleware
     *
     * @param  {Object}           context
     *
     * @return {Promise}
     *
     * @private
     */
    private _executeMiddleware;
    /**
     * Returns the channel controller Class when it is a string.
     *
     * This method relies of the globals of `ioc container`.
     *
     * @method _getChannelController
     *
     * @return {Class}
     *
     * @private
     */
    private _getChannelController;
    /**
     * Returns the listeners on the controller class
     *
     * @method _getChannelControllerListeners
     *
     * @param  {Class}                       Controller
     *
     * @return {Array}
     *
     * @private
     */
    private _getChannelControllerListeners;
    /**
     * Invokes the onConnect handler for the channel.
     *
     * @method _callOnConnect
     *
     * @param  {Object}       context
     *
     * @return {void}
     */
    _callOnConnect(context: Object): void;
    /**
     * Returns the subscriptions set for a given topic. If there are no
     * subscriptions, an empty set will be initialized and returned.
     *
     * @method getTopicSubscriptions
     *
     * @param  {String}              name
     *
     * @return {Set}
     */
    getTopicSubscriptions(topic: any): Set<any>;
    /**
     * Returns the first subscription from all the existing subscriptions
     *
     * @method getFirstSubscription
     *
     * @param  {String}             topic
     *
     * @return {Socket}
     */
    getFirstSubscription(topic: string): Socket;
    /**
     * Join a topic by saving the subscription reference. This method
     * will execute the middleware chain before saving the
     * subscription reference and invoking the onConnect
     * callback.
     *
     * @method joinTopic
     *
     * @param  {Context}  context
     *
     * @return {void}
     */
    joinTopic(context: Context): void;
    /**
     * Add middleware to the channel. It will be called everytime a
     * subscription joins a topic
     *
     * @method middleware
     *
     * @param  {Function|Function[]}   middleware
     *
     * @chainable
     */
    middleware(middleware: Function | Function[]): Channel;
    /**
     * Scope broadcasting to a given topic
     *
     * @method topic
     *
     * @param  {String} topic
     *
     * @return {Object|Null}
     */
    topic(topic: string): Object | null;
    /**
     * Broadcast event message to a given topic.
     *
     * @method broadcastPayload
     *
     * @param  {String}    topic
     * @param  {String}    payload
     * @param  {Array}     filterSockets
     * @param  {Boolean}   inverse
     *
     * @return {void}
     */
    broadcastPayload(topic: string, payload: string, filterSockets: any[] | undefined, inverse: boolean): void;
    /**
     * Invoked when a message is received on cluster node
     *
     * @method clusterBroadcast
     *
     * @param  {String}         topic
     * @param  {String}         payload
     *
     * @return {void}
     */
    clusterBroadcast(topic: string, payload: string): void;
}
