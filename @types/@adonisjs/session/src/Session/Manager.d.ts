declare const _exports: SessionManager;
export = _exports;
/**
 * The session manager class is exposed as IoC container
 * binding, which can be used to add new driver and
 * get an instance of a given driver.
 *
 * @namespace Adonis/Src/Session
 * @manager Adonis/Src/Session
 * @singleton
 * @group Http
 *
 * @class SessionManager
 */
declare class SessionManager {
    _drivers: {};
    /**
     * Method called by ioc when someone extends the session
     * provider to add their own driver
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
     * Makes the instance of driver
     *
     * @method makeDriverInstance
     *
     * @param  {String}           name
     *
     * @return {Object}
     */
    makeDriverInstance(name: string): Object;
}
