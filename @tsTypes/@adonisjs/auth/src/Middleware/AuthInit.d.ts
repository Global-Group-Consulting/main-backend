export = AuthInit;
/**
 * AuthInit middleware attaches a new instance of auth class to the
 * request context.
 *
 * Later the `auth` object can be used to perform available actions.
 *
 * ## Note
 * If your main scheme is set to `session`, this middleware will attempt to
 * validate the user session on each request.
 *
 * @class AuthInitMiddleware
 * @constructor
 * @module Lucid
 *
 * @param {Config} Config - Reference to config provider
 */
declare class AuthInit {
    constructor(Config: any);
    scheme: any;
    /**
     * Attempt to login the user on each request ( if scheme is session ) and share
     * the auth object with the view instance.
     *
     * @method handle
     * @async
     *
     * @param {Object}   ctx - Request context
     * @param {Function} next
     *
     * @return {void}
     */
    handle({ auth, view }: Object, next: Function): void;
    /**
     * Attempt to login the user on each request ( if scheme is session )
     *
     * @method wsHandle
     *
     * @async
     *
     * @param {Object}   ctx - Request context
     * @param {Function} next
     *
     * @return {void}
     */
    wsHandle({ auth }: Object, next: Function): void;
}
