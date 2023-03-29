export = Resolver;
/**
 * This class will resolve a namespace or a pattern
 * from the IoC container. Think of it as a friend
 * to the IoC container for resolving namespaces
 * without worrying where they live.
 *
 * @class Resolver
 * @constructor
 */
declare class Resolver {
    constructor(Ioc: any, directories: any, appNamespace: any, forDirectory?: null);
    /**
     * Reference to the IoC container
     * instance.
     *
     * @type {Object}
     *
     * @attribute Ioc
     */
    Ioc: Object;
    _directories: any;
    _appNamespace: any;
    _forDirectory: any;
    /**
     * Validate directories to exists and is an object
     *
     * @method _validateDirectories
     *
     * @param  {Object}             directories
     *
     * @return {void}
     *
     * @private
     */
    private _validateDirectories;
    /**
     * Validate appNamespace to exist.
     *
     * @method _validateNamespace
     *
     * @param  {String}           appNamespace
     *
     * @return {void}
     *
     * @private
     */
    private _validateNamespace;
    /**
     * Returns the directory name from the pre registered directories
     *
     * @method _getDirectory
     *
     * @return {String}
     *
     * @private
     */
    private _getDirectory;
    /**
     * Makes the correct namespace for a binding. Based upon
     * the app namespace and the directory for which the
     * namespace should be created.
     *
     * @method _makeAppNamespace
     *
     * @param  {String}          binding
     *
     * @return {String}
     *
     * @private
     */
    private _makeAppNamespace;
    /**
     * Normalizes the binding name by removing multiple
     * slashes from start,end and the middle of the
     * binding
     *
     * @method _normalize
     *
     * @param  {String}   binding
     *
     * @return {String}
     *
     * @private
     */
    private _normalize;
    /**
     * Translates a binding into a valid namespace, ready to
     * be resolved via Ioc container
     *
     * @method translate
     *
     * @param  {String}  binding
     *
     * @return {String}
     *
     * @example
     * ```js
     * resolver.for('httpControllers').translate('HomeController')
     * // returns - App/Controllers/HomeController
     * ```
     */
    translate(binding: string): string;
    /**
     * Returns path for a given namespace. This method only works
     * for autoloaded files and not providers.
     *
     * Also existence of a the file on the given path is not guaranteed.
     *
     * @method getPath
     *
     * @param  {String} binding
     *
     * @return {String}
     */
    getPath(binding: string): string;
    /**
     * Resolves the binding from the IoC container. This
     * method is a combination of `translate` and
     * `Ioc.make` function.
     *
     * @method resolve
     *
     * @param  {String} binding
     *
     * @return {Mixed}
     */
    resolve(binding: string): Mixed;
    /**
     * Resolves a function by translating the binding and
     * then validating the existence of the method on
     * the binding object. Also if the `binding` param
     * is a function, it will be recognized and
     * returned.
     *
     * @method resolveFunc
     *
     * @param  {String}    binding
     *
     * @return {Object}
     */
    resolveFunc(binding: string): Object;
}
