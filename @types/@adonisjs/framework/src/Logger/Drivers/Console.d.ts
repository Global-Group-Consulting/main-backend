export = WinstonConsole;
/**
 * Winston console transport driver for @ref('Logger').
 * All the logs will be written to `stdout` or
 * `stderr` based upon the log level.
 *
 * @class WinstonConsole
 * @constructor
 */
declare class WinstonConsole {
    setConfig(config: any): void;
    /**
     * Merging user config with defaults.
     */
    config: any;
    /**
     * Creating new instance of winston with file transport
     */
    logger: any;
    /**
     * A list of available log levels
     *
     * @attribute levels
     *
     * @return {Object}
     */
    get levels(): Object;
    /**
     * Update driver log level at runtime
     *
     * @param  {String} level
     *
     * @return {void}
     */
    set level(arg: string);
    /**
     * Returns the current level for the driver
     *
     * @attribute level
     *
     * @return {String}
     */
    get level(): string;
    /**
     * Log message for a given level.
     *
     * @method log
     *
     * @param  {Number}    level
     * @param  {String}    msg
     * @param  {...Spread} meta
     *
     * @return {void}
     */
    log(level: number, msg: string, ...meta: Spread[]): void;
}
