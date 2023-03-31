declare const _exports: IocResolver;
export = _exports;
/**
 * Custom resolver for @adonisjs/fold. Since Lucid can be
 * used standalone, this class removes direct dependency
 * with IoC container, but requires a small polyfill
 * over IoC container methods.
 *
 * @class IocResolver
 * @constructor
 */
declare class IocResolver {
    _fold: string | null;
    /**
     * Set custom fold instance
     *
     * @method setFold
     *
     * @param  {String} fold
     *
     * @return {void}
     */
    setFold(fold: string): void;
    /**
     * Returns fold resolver instance
     *
     * @attribute resolver
     *
     * @return {Object}
     */
    get resolver(): Object;
    /**
     * Returns fold ioc container instance
     *
     * @attribute ioc
     *
     * @return {Object}
     */
    get ioc(): Object;
}
