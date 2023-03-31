declare const _exports: MailManager;
export = _exports;
/**
 * Mail manager manages the drivers and also
 * exposes the api to add new drivers.
 *
 * @class MailManager
 * @constructor
 */
declare class MailManager {
    _drivers: {};
    /**
     * Exposing api to be extend, IoC container will
     * use this method when someone tries to
     * extend mail provider
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
     * Returns an instance of sender with the defined
     * driver.
     *
     * @method driver
     *
     * @param  {String} name
     * @param  {Object} config
     * @param  {Object} viewInstance
     *
     * @return {MailSender}
     */
    driver(name: string, config: Object, viewInstance: Object): MailSender;
}
import MailSender = require("./Sender");
