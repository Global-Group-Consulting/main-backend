declare const _exports: HashMock;
export = _exports;
/**
 * A hash mock class to be used within tests, which simply
 * doesn't hash passwords at all.
 *
 * @class HashMock
 * @constructor
 */
declare class HashMock {
    /**
     * Returns the value back as it is. Have to be async
     * to be API compatable.
     *
     * @method make
     * @async
     *
     * @param  {String} value
     * @param  {Number} [rounds]
     *
     * @return {String}
     *
     * @example
     * ```js
     * const hashed = await Hash.make('my-secret-password')
     * ```
     */
    make(value: string, rounds?: number | undefined): string;
    /**
     * Verify two strings
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
