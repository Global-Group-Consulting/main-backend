declare const _exports: AntlManager;
export = _exports;
/**
 * Antl manager class is used to manage and
 * get instance of loaders.
 *
 * @class AntlManager
 */
declare class AntlManager {
    _extendedLoaders: {};
    /**
     * Add new custom loaders. This method is called via
     * `Ioc.extend` method
     *
     * @method extend
     *
     * @param  {String} key
     * @param  {Class} implementation
     *
     * @return {void}
     */
    extend(key: string, implementation: Class): void;
    /**
     * Returns the instance of a loader
     *
     * @method loader
     *
     * @param  {String} name
     * @param  {Object} config
     *
     * @return {Loader}
     */
    loader(name: string, config: Object): any;
}
