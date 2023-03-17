export = Session;
/**
 * An instance of this class is generated automatically for
 * each request for the active driver and attached to
 * @ref('HttpContext')
 *
 * @class Session
 * @constructor
 * @group Http
 */
declare class Session {
    constructor(request: any, response: any, driverInstance: any, Config: any);
    _request: any;
    _response: any;
    _driverInstance: any;
    _isNewSessionId: boolean;
    _options: Object;
    _key: string;
    _store: Store | null;
    _sessionId: string | null;
    freezed: boolean;
    /**
     * A boolean flag telling whether store has been
     * initiated or not
     *
     * @attribute initiated
     *
     * @return {Boolean}
     */
    get initiated(): boolean;
    /**
     * Returns a unique session id for the given
     * session.
     *
     * @method _getSessionId
     *
     * @return {String}
     *
     * @private
     */
    private _getSessionId;
    /**
     * Touches the session cookie to make sure it stays
     * alive
     *
     * @method _touchSessionId
     *
     * @param  {String}        sessionId
     *
     * @return {void}
     *
     * @private
     */
    private _touchSessionId;
    /**
     * Throws an exception when session store is
     * not initiated
     *
     * @method _ensureInitiated
     *
     * @return {void}
     *
     * @private
     *
     * @throws {Exception} If session store has not be initiated
     */
    private _ensureInitiated;
    /**
     * Throws exception when session is freezed for modifications
     *
     * @method _ensureNotFreezed
     *
     * @return {void}
     *
     * @private
     *
     * @throws {Exception} If session is freezed
     */
    private _ensureNotFreezed;
    /**
     * Returns an instance of store with existing values
     * for a given session or empty store if session
     * is newly created
     *
     * @method _getValues
     *
     * @return {Store}
     *
     * @private
     */
    private _getValues;
    /**
     * Returns the request body for flashing data inside
     * sessions
     *
     * @method _requestBody
     *
     * @return {Object}
     *
     * @private
     */
    private _requestBody;
    /**
     * Instantiate session object
     *
     * @method instantiate
     *
     * @return {void}
     */
    instantiate(freezed: any): void;
    /**
     * Saves the final set of session values to the
     * driver instance
     *
     * @method commit
     *
     * @return {void}
     */
    commit(): void;
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
     * Flash entire request object to the session
     *
     * @method flashAll
     *
     * @chainable
     */
    flashAll(): Session;
    /**
     * Flash only selected fields from request data to
     * the session
     *
     * @method flashOnly
     *
     * @param  {Array} fields
     *
     * @chainable
     */
    flashOnly(fields: any[]): Session;
    /**
     * Flash request data to the session except
     * certain fields
     *
     * @method flashExcept
     *
     * @param  {Array} fields
     *
     * @chainable
     */
    flashExcept(fields: any[]): Session;
    /**
     * Flash errors to the session
     *
     * @method withErrors
     *
     * @param  {Object}   errors
     *
     * @chainable
     */
    withErrors(errors: Object): Session;
    /**
     * Flash data to the session
     *
     * @method flash
     *
     * @param  {Object} data
     *
     * @chainable
     */
    flash(data: Object): Session;
}
import Store = require("./Store");
