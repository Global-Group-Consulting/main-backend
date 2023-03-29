export = Antl;
/**
 * Antl is public passing API to format values
 * and messages for a given locale
 *
 * @class Antl
 * @constructor
 *
 * @param {String} locale  The local for which values to be formatted
 * @param {Object} messages An object of messages. It should be loaded via a loader.
 */
declare class Antl {
    constructor(locale: any, messages: any);
    _messages: any;
    /**
     * Switch to a different locale at runtime
     *
     * @method switchLocale
     *
     * @param {String} locale
     *
     * @return {void}
     */
    switchLocale(locale: string): void;
    _locale: string | undefined;
    _formatter: Formatter | undefined;
    /**
     * Same as @ref('Antl.switchLocale') but instead
     * returns the reference to `this` for chaining
     *
     * @method forLocale
     *
     * @param {any} locale
     *
     * @chainable
     */
    forLocale(locale: any): Antl;
    /**
     * Returns the current locale
     *
     * @method currentLocale
     *
     * @return {String} locale
     */
    currentLocale(): string;
    /**
     * @see('Formatter.formatNumber')
     */
    formatNumber(...args: any[]): string;
    /**
     * @see('Formatter.formatNumber')
     */
    formatDate(...args: any[]): string;
    /**
     * @see('Formatter.formatNumber')
     */
    formatRelative(...args: any[]): string;
    /**
     * @see('Formatter.formatNumber')
     */
    formatAmount(...args: any[]): string;
    /**
     * @see('Formatter.formatMessage')
     */
    formatMessage(key: any, ...args: any[]): string;
    /**
     * Returns raw message for a given key
     *
     * @method get
     *
     * @param  {String} key
     * @param  {Mixed}  [defaultValue = null]
     *
     * @return {Mixed}
     */
    get(key: string, defaultValue?: any): Mixed;
    /**
     * Returns an array of locales available. This
     * list is based of the messages defined.
     *
     * @method availableLocales
     *
     * @return {Array}
     */
    availableLocales(): any[];
    /**
     * Returns a list of strings for the active
     * locale and an optionally selected group.
     *
     * @method list
     *
     * @param  {String} [group]
     *
     * @return {Object}
     */
    list(group?: string | undefined): Object;
    /**
     * Returns a flat list of strings for the active
     * locale and optionally for a group
     *
     * @method flatList
     *
     * @param  {String} [group]
     *
     * @return {Object}
     */
    flatList(group?: string | undefined): Object;
}
import Formatter = require("../Formatter");
