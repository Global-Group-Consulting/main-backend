declare const _exports: ChannelsManager;
export = _exports;
/**
 * Manages the list of registered channels. Also this class is used to return
 * the matching channel for a given topic.
 *
 * @class ChannelsManager
 */
declare class ChannelsManager {
    channels: Map<any, any>;
    _channelExpressions: any[];
    /**
     * Normalizes the channel name by removing starting and
     * ending slashes
     *
     * @method _normalizeName
     *
     * @param  {String}       name
     *
     * @return {String}
     *
     * @private
     */
    private _normalizeName;
    /**
     * Generates regex expression for the channel name, it is
     * used to match topics and find the right channel for it.
     *
     * @method _generateExpression
     *
     * @param  {String}            name
     *
     * @return {RegExp}
     *
     * @private
     */
    private _generateExpression;
    /**
     * Resets channels array
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
    /**
     * Adds a new channel to the store
     *
     * @method add
     *
     * @param  {String} name
     * @param  {Function} onConnect
     */
    add(name: string, onConnect: Function): Channel;
    /**
     * Returns an existing channel instance
     *
     * @method get
     *
     * @param  {String} name
     *
     * @return {Channel}
     */
    get(name: string): Channel;
    /**
     * Returns channel for a given topic
     *
     * @method resolve
     *
     * @param  {String} topic
     *
     * @return {Channel|Null}
     */
    resolve(topic: string): Channel | null;
}
import Channel = require("./index");
