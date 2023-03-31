export = SessionMiddleware;
/**
 * Session middleware is used to attach session to the
 * HTTP context.
 *
 * Also this class auto commits the session changes
 * when response is made
 *
 * @namespace Adonis/Middleware/Session
 * @group Http
 *
 * @class SessionMiddleware
 * @constructor
 */
declare class SessionMiddleware {
    /**
     * Handle method to be executed on each request
     *
     * @method handle
     *
     * @param  {Object}   ctx
     * @param  {Function} next
     *
     * @return {void}
     */
    handle(ctx: Object, next: Function): void;
    /**
     * Initiates the session store in read only mode
     *
     * @method wsHandle
     *
     * @param  {Session}   options.session
     * @param  {Function} next
     *
     * @return {void}
     */
    wsHandle({ session }: Session, next: Function): void;
}
