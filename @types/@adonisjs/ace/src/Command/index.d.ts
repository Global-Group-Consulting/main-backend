export = Command;
/**
 * The base command is supposed to be extended by
 * every other command to work properly.
 *
 * @class Command
 * @static
 */
declare class Command {
    /**
     * Returns a string for registered arguments
     * to be displayed in the help output.
     *
     * @method _stringifyArgs
     * @static
     *
     * @return {String}
     *
     * @private
     */
    private static _stringifyArgs;
    /**
     * Validates the existence of name on an argument/option.
     *
     * @method _validateName
     * @static
     *
     * @param  {String}      name
     *
     * @return {void}
     *
     * @throws {Error} If name is missing
     *
     * @private
     */
    private static _validateName;
    /**
     * Check whether command is not booted or not.
     *
     * @method _ensureIsBooted
     * @static
     *
     * @return {void}
     *
     * @throws {Error} If booted is not set to true
     *
     * @private
     */
    private static _ensureIsBooted;
    /**
     * Returns formatted argument or option name to be used
     * for help screen or when registering values with
     * commander.
     *
     * @method _getArgOrOptionName
     * @static
     *
     * @param  {Object}       input
     *
     * @return {String}
     *
     * @private
     */
    private static _getArgOrOptionName;
    /**
     * Intitate class properties by defining them. Since
     * these properties are static inheritance breaks
     * and we need to define it on each class.
     *
     * @method _initiate
     * @static
     *
     * @return {void}
     *
     * @private
     */
    private static _initiate;
    /**
     * Binds the commander instance to the command
     * static interface.
     *
     * @method _bindCommander
     * @static
     *
     * @return {void}
     *
     * @private
     */
    private static _bindCommander;
    /**
     * Register all arguments with commander.
     *
     * @method _registerArgsWithCommander
     * @static
     *
     * @return {void}
     *
     * @private
     */
    private static _registerArgsWithCommander;
    /**
     * Registers all options with commander.
     *
     * @method _registerOptionsWithCommander
     * @static
     *
     * @return {void}
     *
     * @private
     */
    private static _registerOptionsWithCommander;
    /**
     * The command name getter. Only define when
     * you are not defining the signature.
     *
     * @attribute commandName
     * @static
     *
     * @return {String}
     */
    static get commandName(): string;
    /**
     * The command signature getter to define the
     * command name, arguments and options.
     *
     * @attribute signature
     * @static
     *
     * @return {String}
     */
    static get signature(): string;
    /**
     * The command description getter.
     *
     * @attribute description
     * @static
     *
     * @return {String}
     */
    static get description(): string;
    /**
     * Add an argument to the command. Below is the list of
     * allowed values.
     *
     * You only define arguments manually when you have
     * not defined the `signature`.
     *
     * - **name** - The argument name
     * - **optional=false** - Whether or not argument is optional
     * - **defaultValue=null** - Default value
     * - **description** - The argument description
     *
     * @method addArgument
     * @static
     *
     * @param  {Object}    arg
     *
     * @chainable
     *
     * @example
     * ```js
     * static boot () {
     *   super.boot()
     *
     *   this.addArgument({ name: 'name', optional: true })
     *
     *   // default Value
     *   this.addArgument({ name: 'name', defaultValue: 'foo' })
     * }
     * ```
     */
    static addArgument(arg?: Object): typeof Command;
    /**
     * Add an option to the command. Below is the list of
     * allowed values.
     *
     * You only define options manually when you have
     * not defined the `signature`.
     *
     * - **name** - The option name
     * - **optional=false** - Whether or not option is optional
     * - **defaultValue=null** - Default value
     * - **description** - The option description
     *
     *
     * @method addOption
     * @static
     *
     * @param  {Object}  option
     *
     * @chainable
     *
     * @example
     * ```js
     * static boot () {
     *   super.boot()
     *
     *   this.addOption({ name: '--file', optional: true })
     *
     *    // default Value
     *    this.addOption({ name: '--file', defaultValue: 'UserController' })
     * }
     * ```
     */
    static addOption(option?: Object): typeof Command;
    /**
     * Parses the signature by tokenizing the string
     * and set the command name, also set arguments
     * and options by calling `addArgument` and
     * `addOption` methods.
     *
     * This method is called automatically by the
     * `boot` method.
     *
     * @method parseSignature
     * @static
     *
     * @return {void}
     */
    static parseSignature(): void;
    /**
     * Returns the length of the biggest name inside args and
     * options both. It is required to have a symmetrical
     * help screen.
     *
     * When there are no args or options, 0 is returned.
     *
     * @method biggestArg
     * @static
     *
     * @return {Number}
     */
    static biggestArg(): number;
    /**
     * Returns a multiline string to be used as the help
     * output. This method does not write anything to
     * console and consumer to should do it
     * themselves.
     *
     * @method outputHelp
     * @static
     *
     * @param  {Boolean}  colorize - Whether or not colorize the output
     *
     * @return {String}
     */
    static outputHelp(colorize?: boolean): string;
    /**
     * Initializes the command by parsing the signature and
     * register arguments/options on command.
     *
     * Don't do anything if command has already be booted.
     *
     * @method boot
     * @static
     *
     * @return {void}
     *
     * @chainable
     *
     * @throws {Error} If command does not have a name.
     */
    static boot(): void;
    /**
     * Wires the command attributes to commander, so
     * that commander can run the command when
     * someone executes it via commandline.
     *
     * @method wireUpWithCommander
     * @static
     *
     * @return {void}
     */
    static wireUpWithCommander(): void;
    /**
     * The commander action executed everytime command is
     * executed via command line.
     *
     * @method commanderAction
     * @static
     *
     * @param  {...Spread}     input
     *
     * @return {Mixed}
     */
    static commanderAction(...input: Spread[]): Mixed;
    /**
     * Executes the command handle method by initiating
     * a new instance of command.
     *
     * @method exec
     * @static
     *
     * @param  {Object} args
     * @param  {Object} options
     * @param  {Boolean} viaAce
     *
     * @return {Mixed}
     */
    static exec(args: Object, options: Object, viaAce: boolean): Mixed;
    chalk: any;
    /**
     * List of icons
     *
     * @type {Object}
     */
    iconsMain: Object;
    /**
     * The icons to be used on windows
     *
     * @type {Object}
     */
    iconsWin: Object;
    /**
     * The handle method to be executed
     * when running command
     *
     * @method handle
     *
     * @return {void}
     */
    handle(): void;
    /**
     * Log info message to the console with cyan
     * color.
     *
     * @method info
     *
     * @param  {...Spread} input - Multiple messages
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.info('Something worth sharing')
     * ```
     */
    info(...input: Spread[]): void;
    /**
     * Log warn message to the console with yellow color.
     * Also this method will use `console.warn` instead
     * of `console.log`
     *
     * @method warn
     *
     * @param  {...Spread} input - Multiple messages
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.warn('Fire in the hole')
     * ```
     */
    warn(...input: Spread[]): void;
    /**
     * Log success message to the console with green color.
     *
     * @method success
     *
     * @param  {...Spread} input - Multiple messages
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.success('All went fine')
     * ```
     */
    success(...input: Spread[]): void;
    /**
     * Log error message to the console with red color.
     * Also this method will use `console.error`
     * instead of `console.log`
     *
     * @method error
     *
     * @param  {...Spread} input - Multiple messages
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.error('Something is broken')
     * ```
     */
    error(...input: Spread[]): void;
    /**
     * Print an action with message to the console
     *
     * @method completed
     *
     * @param  {String}  action
     * @param  {String}  message
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.completed('create', 'Created controller file')
     * ```
     */
    completed(action: string, message: string): void;
    /**
     * Print failed action the console. Also `console.error`
     * is used over `console.log`
     *
     * @method failed
     *
     * @param  {String} action
     * @param  {String} message
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.failed('create', 'File already exists')
     * ```
     */
    failed(action: string, message: string): void;
    /**
     * Print table to the command line.
     *
     * @method table
     *
     * @param  {Array} head
     * @param  {Array} body
     * @param  {Object} [style = {}]
     *
     * @return {void}
     *
     * @example
     * ```js
     * this.table(['Name', 'Age'], [['virk', 22], ['joe', 23]])
     * this.table(['Name', 'Age'], {virk: '22', joe: 21})
     * this.table(['Name', 'Age'], {virk: '22', joe: 21}, {head: ['red']})
     * ```
     */
    table(head: any[], body: any[], style?: Object | undefined): void;
    /**
     * Returns a colored icon for a given type. Allowed
     * types are `info`, `warn`, `success` and `error`.
     *
     * @method icon
     *
     * @param  {String} type
     *
     * @return {String}
     */
    icon(type: string): string;
    /**
     * Write file to a given location if parent
     * directory/directories does not exists
     * they will be created
     *
     * @method writeFile
     * @async
     *
     * @param  {String}  file
     * @param  {String}  content
     * @param  {Object}  options
     *
     * @return {Promise}
     */
    writeFile(file: string, content: string, options: Object): Promise<any>;
    /**
     * Empty the directory by removing everything
     * from it but not the directory itself.
     *
     * @method emptyDir
     * @async
     *
     * @param  {String} dir
     *
     * @return {Promise}
     */
    emptyDir(dir: string): Promise<any>;
    /**
     * Make sure the file exists, otherwise create the
     * empty file.
     *
     * @method ensureFile
     * @async
     *
     * @param  {String}   file
     *
     * @return {Promise}
     */
    ensureFile(file: string): Promise<any>;
    /**
     * Ensure a directory exists or create one
     *
     * @method ensureDir
     * @async
     *
     * @param  {String}  dir
     *
     * @return {Promise}
     */
    ensureDir(dir: string): Promise<any>;
    /**
     * Returns a boolean indicating whether file
     * exists or not.
     *
     * @method pathExists
     * @async
     *
     * @param  {String}   file
     *
     * @return {Promise}
     */
    pathExists(file: string): Promise<any>;
    /**
     * Removes the file from the disk
     *
     * @method removeFile
     * @async
     *
     * @param  {String}   file
     *
     * @return {Promise}
     */
    removeFile(file: string): Promise<any>;
    /**
     * Read file from the disk
     *
     * @method readFile
     * @async
     *
     * @param  {String} file
     * @param  {String} [encoding]
     *
     * @return {String}
     */
    readFile(file: string, encoding?: string | undefined): string;
    /**
     * Removes directory
     *
     * @method removeDir
     * @async
     *
     * @param  {String}  dir
     *
     * @return {Promsie}
     */
    removeDir(dir: string): Promsie;
    /**
     * Copy file from src directory to destination
     *
     * @method copy
     * @async
     *
     * @param  {String} src
     * @param  {String} dest
     * @param  {Object} [options = {}]
     *
     * @return {Promise}
     */
    copy(src: string, dest: string, options?: Object | undefined): Promise<any>;
    /**
     * Move file from src directory to destination
     *
     * @method move
     * @async
     *
     * @param  {String} src
     * @param  {String} dest
     * @param  {Object} [options = {}]
     *
     * @return {Promise}
     */
    move(src: string, dest: string, options?: Object | undefined): Promise<any>;
    /**
     * Generate file from a mustache template. In the process
     * it will make sure that file does not exists before
     * creating it.
     *
     * @method generateFile
     * @async
     *
     * @param  {String}     file
     * @param  {String}     template
     * @param  {Object}     data
     *
     * @return {Promise}
     *
     * @throws {Error} If file already exists.
     */
    generateFile(file: string, template: string, data: Object): Promise<any>;
}
