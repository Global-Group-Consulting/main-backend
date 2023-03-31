declare const _exports: HashManager;
export = _exports;
/**
 * Hash plain values using the provided hash algorithm.
 * It is considered to be used when saving user passwords to the database.
 *
 * @manager
 * @group Hash
 * @singleton Yes
 *
 * @class HashManager
 * @static
 */
declare class HashManager {
    _drivers: {};
    /**
     * Extend hasher by adding your own drivers
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
     * Returns the driver instance for a given driver.
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
