export = kernel;
declare const kernel: Kernel;
/**
 * An Instance of kernel is exported as the
 * main module. It is used to register
 * and invoke commands on command line.
 *
 * Also ace can be used to call commands
 * manually.
 *
 * @class Kernel
 */
declare class Kernel {
    /**
     * An object containing all the
     * registered commands.
     *
     * @type {Object}
     */
    commands: Object;
    /**
     * Handler to listen for command errors
     *
     * @type {Function}
     */
    _cmdErrorHandler: Function;
    /**
     * Returns group of commands under a given namespace. Commands
     * by splitted by `:` and the first item inside the array
     * is used as the namespace. All commands without a
     * namespace are grouped under the root namespace.
     *
     * @method _groupCommands
     *
     * @return {Object}
     *
     * @private
     */
    private _groupCommands;
    /**
     * Returns the biggest command name length
     *
     * @package {Array} options
     *
     * @method _largestCommandLength
     *
     * @return {String}
     *
     * @private
     */
    private _largestCommandLength;
    /**
     * Push group commands and namespace to the strings
     * array
     *
     * @method _pushGroups
     *
     * @param  {String}    name
     * @param  {Array}    commands
     * @param  {Number}    maxWidth
     * @param  {Array}    strings
     *
     * @return {void}
     *
     * @private
     */
    private _pushGroups;
    /**
     * Bubbles command errors to the main error listener
     *
     * @method _bubbleError
     *
     * @param  {Object}     error
     * @param  {String}     commandName
     *
     * @return {void}
     *
     * @private
     */
    private _bubbleError;
    /**
     * Attach callback to listen for command errors. The
     * errors are only reported for top level commands.
     *
     * If an internal invoked command throws an exception,
     * it will be not be reported to this handler.
     *
     * @method onError
     *
     * @param  {Function} callback
     *
     * @chainable
     */
    onError(callback: Function): Kernel;
    /**
     * Adding a new command by passing a command class
     * or reference to the IoC container namespace.
     *
     * The IoC container namespace only works when `use`
     * global exists.
     *
     * @method addCommand
     *
     * @param  {Class|String}   command
     *
     * @example
     * ```js
     * class Greet extends Command {
     *   static get signature () {
     *     return 'greet'
     *   }
     * }
     *
     * ace.addCommand(Greet)
     * ```
     */
    addCommand(command: Class | string): void;
    /**
     * Add a new inline command by defining a signature
     * description and a closure to be executed when
     * command runs.
     *
     * @method command
     *
     * @param  {String}   signature
     * @param  {String}
     * @param  {Function} handle
     *
     * @return {void}
     *
     * @example
     * ```js
     * ace.command('make:controller {name}', 'Add a controller', function () {
     * })
     *
     * // with optional description
     * ace.command('make:controller {name}', function () {
     * })
     * ```
     */
    command(signature: string, description: any, handle: Function): void;
    /**
     * Wiring up each command with commander. It is
     * only required when commands are invoked
     * via command line.
     *
     * @method wireUpWithCommander
     *
     * @return {void}
     */
    wireUpWithCommander(): void;
    /**
     * Returns the command class using it's name.
     *
     * @method getCommand
     *
     * @param  {String}   name
     *
     * @return {Class}
     */
    getCommand(name: string): Class;
    /**
     * Executes the command using it's name.
     *
     * @method call
     *
     * @param  {String}    name
     * @param  {Object}    args
     * @param  {Object}    options
     *
     * @return {Mixed}
     *
     * @example
     * ```js
     * const output = await ace.call('greet', { name: 'virk' })
     * ```
     */
    call(name: string, args?: Object, options?: Object): Mixed;
    /**
     * Invokes commander to process the argv
     * and run command.
     *
     * @method invoke
     *
     * @return {void}
     */
    invoke(packageJson: any): void;
    /**
     * Returns a multiline string to be used for showing
     * the help screen.
     *
     * @method outputHelp
     *
     * @param  {Object}   options
     *
     * @return {Array}
     */
    outputHelp(options: Object, colorize?: boolean): any[];
}
