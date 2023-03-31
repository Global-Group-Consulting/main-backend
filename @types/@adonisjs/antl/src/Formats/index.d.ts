declare const _exports: Formats;
export = _exports;
/**
 * Formats is a store to set and get custom
 * formats.
 *
 * @class Formats
 * @constructor
 */
declare class Formats {
    /**
     * Reset registered format
     *
     * @method clear
     *
     * @return {void}
     */
    clear(): void;
    _registered: {} | undefined;
    /**
     * Add a new custom format
     *
     * @method add
     *
     * @param  {String} name
     * @param  {Object} options
     *
     * @example
     * ```js
     * format.add('amount', { style: 'currency' })
     * ```
     *
     * @chainable
     */
    add(name: string, options: Object): Formats;
    /**
     * Get custom format by name
     *
     * @method get
     *
     * @param  {String} name
     *
     * @return {Object}
     */
    get(name: string): Object;
    /**
     * Returns an object which can be passed to `formatMessage`
     * in order to pass custom formats.
     *
     * @method pass
     *
     * @param  {String} format
     * @param  {String} type
     *
     * @return {Object}
     */
    pass(format: string, type: string): Object;
}
