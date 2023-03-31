declare const _exports: LoggerManager;
export = _exports;
/**
 * Logger manager is binded to IoC container as a manager, which
 * can be used to extend logger by adding your own drivers.
 *
 * @manager
 * @group Core
 * @binding Adonis/Src/Logger
 *
 * @class LoggerManager
 * @constructor
 */
declare class LoggerManager {
    _drivers: {};
    /**
     * Extend logger by adding your own drivers
     *
     * @method extend
     *
     * @param  {String} name
     * @param  {Object} implementation
     *
     * @return {void}
     */
    extend(name: string, implementation: Object): void;
    /**
     * Returns the driver instance for a given driver. Also
     * calls `setConfig` method on the driver to pass
     * the configuration
     *
     * @method driver
     *
     * @param  {String} name
     * @param  {Object} config
     *
     * @return {Object}
     */
    driver(name: string, config: Object): Object;
}
