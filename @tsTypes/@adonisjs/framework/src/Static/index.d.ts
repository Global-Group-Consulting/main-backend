declare function _exports(Helpers: any, Config: any): Static;
export = _exports;
/**
 * Server middleware to serve static resources. All GET and HEAD
 * requests are handled by this middleware and response is
 * made when there is a resource inside the `public`
 * directory.
 *
 * @binding Adonis/Src/Static
 * @alias Static
 * @group Http
 *
 * @class Static
 */
declare class Static {
    /**
     * The handle method called by Server on each request
     *
     * @method handle
     *
     * @param  {Object}   options.request
     * @param  {Object}   options.response
     * @param  {Function} next
     *
     * @return {void}
     */
    handle({ request, response }: Object, next: Function): void;
}
