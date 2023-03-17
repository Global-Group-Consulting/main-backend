export = Argon;
/**
 * adonis-framework
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
/**
 * Hash plain values using [argon2](https://github.com/P-H-C/phc-winner-argon2).
 *
 * @group Hash
 *
 * @class Argon
 */
declare class Argon {
    argon2: any;
    config: {};
    /**
     * Consumes argon config
     *
     * @method setConfig
     *
     * @param  {Object}  config
     */
    setConfig(config: Object): void;
    /**
     * Hash plain value using argon2.
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
