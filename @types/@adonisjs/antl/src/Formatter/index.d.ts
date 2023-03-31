export = Formatter;
declare class Formatter {
    constructor(locale: any);
    _locale: any;
    /**
     * Formats a number using Intl.NumberFormat. Visit
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat to
     * learn more about configuration options.
     *
     * @method formatNumber
     *
     * @param  {Number}     value
     * @param  {Object}     [options]
     * @param  {String}     [fallback] Fallback text when actual value is missing
     *
     * @return {String}
     *
     * @example
     * ```js
     * formatter
     *   .formatNumber(1000, { style: 'currency', currency: 'usd' })
     * ```
     */
    formatNumber(value: number, options?: Object | undefined, fallback?: string | undefined): string;
    /**
     * Formats the date as per Intl.DateTimeFormat. Learn more about it
     * at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
     *
     * @method formatDate
     *
     * @param  {String|Date|Number}   value
     * @param  {Object}               options
     * @param  {String}               fallback
     *
     * @return {String}
     *
     * @example
     * ```js
     * formatter
     *   .formatDate(new Date())
     * ```
     */
    formatDate(value: string | Date | number, options: Object, fallback: string): string;
    /**
     * Formats the date relative from the current timestamp. It is
     * based on https://github.com/yahoo/intl-relativeformat.
     *
     * @method formatRelative
     *
     * @param  {Date|String|Number}       value
     * @param  {Object}                   [options]
     * @param  {String}                   [fallback]
     *
     * @return {String}
     */
    formatRelative(value: Date | string | number, options?: Object | undefined, fallback?: string | undefined): string;
    /**
     * Formats the number as a currency
     *
     * @method formatAmount
     *
     * @param  {Number}     value
     * @param  {String}     currency
     * @param  {Object}     [options]
     * @param  {String}     [fallback]
     *
     * @return {String}
     *
     * @throws {InvalidArgumentException} If currency is missing
     */
    formatAmount(value: number, currency: string, options?: Object | undefined, fallback?: string | undefined): string;
    /**
     * Formats a message using ICU messaging
     * syntax
     *
     * @method formatMessage
     *
     * @param  {String}            message
     * @param  {Object}            values
     * @param  {Object|Array}      [formats]
     *
     * @return {String}
     *
     * @example
     * ```js
     * formatter
     *   .formatMessage('Hello { username }', { username: 'virk' })
     * ```
     *
     * @example
     * ```js
     * formatter
     *   .formatMessage('Total { total, number, usd }', { total: 20 }, [formats.pass('usd', 'number')])
     * ```
     */
    formatMessage(message: string, values: Object, formats?: Object | any[] | undefined): string;
}
