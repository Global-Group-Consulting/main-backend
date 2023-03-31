export = ResolverManager;
/**
 * ResolverManager is the public interface to
 * register directories and resolve them
 * later.
 *
 * The registering process needs to be only done once by
 * the application not by providers. Providers should
 * assume that the registering process is done in
 * advance and only call functions to resolve
 * bindings.
 *
 * @class ResolveManager
 * @static
 */
declare class ResolverManager {
    constructor(Ioc: any);
    _appNamespace: string | null;
    _directories: {};
    _Ioc: any;
    /**
     * Returns instance of resolver.
     *
     * @method _getInstance
     *
     * @param  {String}     [forDir = null]
     *
     * @return {Resolver}
     *
     * @private
     */
    private _getInstance;
    /**
     * Register directories to be used for making
     * namespaces
     *
     * @method directories
     *
     * @param  {Object}    dirs
     *
     * @chainable
     */
    directories(dirs: Object): ResolverManager;
    /**
     * Set app namespace to be used for making
     * complete namespaces from relative
     * namespaces.
     *
     * @method appNamespace
     *
     * @param  {String}     namespace
     *
     * @chainable
     */
    appNamespace(namespace: string): ResolverManager;
    /**
     * Returns the resolver instance specified
     * to translate namespace for a given
     * directory only.
     *
     * @method forDir
     *
     * @param  {String} forDir
     *
     * @return {Resolver}
     */
    forDir(forDir: string): Resolver;
    /**
     * Translate binding using resolver translate
     * method.
     */
    translate(...params: any[]): string;
    /**
     * Resolve binding using resolver resolve
     * method.
     */
    resolve(...params: any[]): Mixed;
    /**
     * Resolve binding using resolver resolveFunc
     * method.
     */
    resolveFunc(...params: any[]): Object;
}
import Resolver = require("./index");
