export = BriskRoute;
declare class BriskRoute {
    constructor(routePath: any);
    routePath: any;
    _handlerDefined: boolean;
    /**
     * Sets the handler for brisk route.
     *
     * @method setHandler
     *
     * @param  {Function|String}   handler
     * @param  {Array}   verbs
     *
     * @return {Route}
     *
     * @throws {RuntimeException} If trying to re-define handler for the route
     */
    setHandler(handler: Function | string, verbs: any[]): Route;
    /**
     * Render a view from the route
     *
     * @method render
     *
     * @param  {String} template
     * @param  {Object} data
     *
     * @return {Route}
     */
    render(template: string, data?: Object): Route;
}
declare namespace BriskRoute {
    const _macros: Object;
    const _getters: {};
}
import Route = require("./index");
