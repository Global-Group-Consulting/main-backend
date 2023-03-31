export = Hash;
/**
 * adonis-framework
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
/**
 * Hash plain values using the provided hash algorithm.
 * It is considered to be used when saving user passwords to the database.
 *
 * @group Hash
 * @singleton Yes
 *
 * @class Hash
 * @constructor
 */
declare class Hash {
    constructor(driver: any);
    /**
     * The driver in use for logging
     *
     * @type {Object}
     *
     * @attribute driver
     */
    driver: Object;
    /**
     * Hash plain value using the given driver.
     *
     * @method make
     * @async
     *
     * @param  {String} value
     * @param  {Object} config
     *
     * @return {String}
     *
     * @example
     * ```js
     * const hashed = await Hash.make('my-secret-password')
     * ```
     */
    make(value: string, config: Object): string;
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
     *
     * @example
     * ```
     * const verified = await Hash.verify('password', 'existing-hash')
     * if (verified) {
     * }
     * ```
     */
    verify(value: string, hash: string): boolean;
}
