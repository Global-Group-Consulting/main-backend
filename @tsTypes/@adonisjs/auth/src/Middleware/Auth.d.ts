export = Auth;
/**
 * Auth middleware protects the Routes ensuring a user is loggedin
 * before the request reaches the controller.
 *
 * ```
 * Route
 * .get('...')
 * .middleware('auth')
 * ```
 *
 * You can define one or multiple schemes to be tried.
 * ```
 * Route
 * .get('...')
 * .middleware('auth:basic,jwt')
 * ```
 *
 * @class AuthMiddleware
 * @constructor
 * @module Lucid
 *
 * @param {Config} Config - Reference to config provider
 */
declare class Auth {
    constructor(Config: any);
    scheme: any;
    /**
     * Attempts to authenticate the user using defined multiple schemes and
     * stops on the first one
     *
     * @method _authenticate
     *
     * @param  {Object}      auth
     * @param  {Array}      schemes
     *
     * @return {void}
     */
    _authenticate(auth: Object, schemes: any[]): void;
    /**
     * Authenticate the user using one of the defined
     * schemes or the default scheme
     *
     * @method handle
     * @async
     *
     * @param {Object}   ctx       Request context
     * @param {Function} next
     * @param {Array}    schemes   Schemes for which the user must be validated.
     *                             If no scheme is defined, then default scheme from config is used.
     *
     * @return {void}
     */
    handle({ auth, view }: Object, next: Function, schemes: any[]): void;
    /**
     * Called when authenticating user for websocket request
     *
     * @method wsHandle
     *
     * @param {Object}   ctx       Request context
     * @param {Function} next
     * @param {Array}    schemes   Schemes for which the user must be validated.
     *                             If no scheme is defined, then default scheme from config is used.
     *
     * @return {void}
     */
    wsHandle({ auth }: Object, next: Function, schemes: any[]): void;
}
