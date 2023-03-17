export = SessionClient;
/**
 * Session client to set sessions as
 * cookies.
 *
 * @constructor
 * @class SessionClient
 */
declare class SessionClient {
    constructor(Config: any, cookies: any);
    _sessionId: any;
    _key: string;
    _store: Store;
    /**
     * @inheritDoc('Store.put')
     */
    put(...args: any[]): void;
    /**
     * @inheritDoc('Store.get')
     */
    get(...args: any[]): Mixed;
    /**
     * @inheritDoc('Store.all')
     */
    all(...args: any[]): Object;
    /**
     * @inheritDoc('Store.forget')
     */
    forget(...args: any[]): void;
    /**
     * @inheritDoc('Store.pull')
     */
    pull(...args: any[]): Mixed;
    /**
     * @inheritDoc('Store.increment')
     */
    increment(...args: any[]): void;
    /**
     * @inheritDoc('Store.decrement')
     */
    decrement(...args: any[]): void;
    /**
     * @inheritDoc('Store.clear')
     */
    clear(): void;
    /**
     * Returns an object with keys and values
     * to be set as cookies
     *
     * @method toJSON
     *
     * @return {Array}
     */
    toJSON(): any[];
}
import Store = require("./Store");
