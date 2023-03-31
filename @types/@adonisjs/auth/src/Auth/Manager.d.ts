declare const _exports: AuthManager;
export = _exports;
/**
 * Auth manager manages the schemes and serializers
 */
declare class AuthManager {
    _serializers: {};
    _schemes: {};
    /**
     * Extend authenticator by adding a new scheme or serializer.
     * You make use of this method via `Ioc.extend` interface
     *
     * @method extend
     *
     * @param  {String} key
     * @param  {Object} implementation
     * @param  {String} type
     *
     * @return {void}
     */
    extend(key: string, implementation: Object, type: string): void;
    /**
     * Returns the instance of a given serializer
     *
     * @method getSerializer
     *
     * @param  {String}      name
     *
     * @return {Object}
     */
    getSerializer(name: string): Object;
    /**
     * Returns the instance of a given scheme
     *
     * @method getScheme
     *
     * @param  {String}  name
     *
     * @return {Object}
     */
    getScheme(name: string): Object;
}
