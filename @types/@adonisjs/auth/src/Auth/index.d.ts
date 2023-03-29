export = Auth;
/**
 * The auth class is used to authenticate users using a pre-defined
 * authenticator in the auth config.
 *
 * This class proxies all the methods of the `scheme` that is currently
 * in use. So do make sure to refer the schemes API.
 *
 * @class Auth
 * @module Lucid
 * @constructor
 *
 * @param {Context} ctx     Request context
 * @param {Config}  Config  Reference to config provider
 */
declare class Auth {
    constructor(ctx: any, Config: any);
    _ctx: any;
    Config: any;
    _authenticatorsPool: {};
    authenticatorInstance: Scheme;
    /**
     * Newup an authenticator instance for a given name. The names must be a
     * reference for the `keys` inside the `config/auth.js` file.
     *
     * @method authenticator
     *
     * @param  {String}      name
     *
     * @return {Scheme}
     */
    authenticator(name: string): Scheme;
}
