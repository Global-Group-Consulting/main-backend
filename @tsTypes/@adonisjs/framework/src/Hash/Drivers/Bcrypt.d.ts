export = Bcrypt;
/**
 * Hash plain values using [bcryptjs](https://www.npmjs.com/package/bcryptjs).
 *
 * @group Hash
 *
 * @class Bcrypt
 */
declare class Bcrypt {
    config: {};
    /**
     * Consumes bcrypt config
     *
     * @method setConfig
     *
     * @param  {Object}  config
     */
    setConfig(config: Object): void;
    /**
     * Hash plain value using bcrypt.
     *
     * @method make
     * @async
     *
     * @param  {String} value
     * @param  {Object} config
     *
     * @return {String}
     */
    make(value: string, config?: Object): string;
    /**
     * Verify an existing hash with the plain value. Though this
     * method returns a promise, it never rejects the promise
     * and this is just for the sake of simplicity, since
     * bcrypt errors are not something that you can act
     * upon.
     *
     * @method verify
     * @async
     *
     * @param  {String} value
     * @param  {String} hash
     *
     * @return {Boolean}
     */
    verify(value: string, hash: string): boolean;
}
