export = LoggerFacade;
/**
 * LoggerFacade is exposed by IoC container and it proxy
 * methods over @ref('Logger') class.
 *
 * @group Core
 * @binding Adonis/Src/Logger
 * @alias Logger
 *
 * @class LoggerFacade
 * @constructor
 */
declare class LoggerFacade {
    constructor(Config: any);
    Config: any;
    _loggerInstances: {};
    /**
     * Returns the @ref('Logger') class instance for a given
     * transport.
     *
     * @method transport
     *
     * @param  {String}  name
     *
     * @return {Logger}
     */
    transport(name: string): Logger;
}
import Logger = require("./index");
