export = Ignitor;
declare class Ignitor {
    constructor(fold: any);
    _fold: any;
    _appRoot: string | null;
    _modulesRoot: string | null;
    _loadCommands: boolean;
    /**
     * Files to be preloaded
     *
     * @type {Array}
     */
    _preLoadFiles: any[];
    /**
     * The preloaded files that are optional
     *
     * @type {Array}
     */
    _optionals: any[];
    /**
     * Default app file
     *
     * @type {String}
     */
    _appFile: string;
    /**
     * Ws server reference to run it
     */
    _wsServer: {
        run: boolean;
        customHttpServer: null;
    };
    /**
     * The app namespace registered with resolver
     * for autoloading directories
     *
     * @type {String|Null}
     */
    appNamespace: string | null;
    /**
     * Returns the matching index of a file
     * inside the preloaded files.
     *
     * @method _getMatchingIndex
     *
     * @param  {String}          fileToMatch
     *
     * @return {Number}
     *
     * @private
     */
    private _getMatchingIndex;
    /**
     * Calls a given hook
     *
     * @method _callHooks
     *
     * @param  {String}  lifecycle
     * @param  {String}  event
     *
     * @return {void}
     *
     * @private
     */
    private _callHooks;
    /**
     * Requires the app package.json file from
     * the app root.
     *
     * @method _setPackageFile
     *
     * @private
     */
    private _setPackageFile;
    _packageFile: any;
    /**
     * Sets up resolver primary namespace and register paths to
     * important directories.
     *
     * @method _setupResolver
     *
     * @param {String} namespace
     *
     * @return {void}
     *
     * @private
     */
    private _setupResolver;
    /**
     * Registers all directories from the package.json file
     * to IoC container as autoloaded.
     *
     * First namespace/directory key/value pair will be used as
     * primary autoloaded directory and doesn't require
     * fullnamespaces at different places.
     *
     * @method _registerAutoloadedDirectories
     *
     * @return {void}
     *
     * @private
     */
    private _registerAutoloadedDirectories;
    /**
     * Registers the helpers module to the IoC container.
     * Required by a lot of providers before hand.
     *
     * @method _registerHelpers
     *
     * @return {void}
     *
     * @private
     */
    private _registerHelpers;
    /**
     * Return the exported values from the appFile. Also
     * it will validate the exports object to have all
     * required keys.
     *
     * @method _getAppAttributes
     *
     * @return {Object}
     *
     * @private
     */
    private _getAppAttributes;
    /**
     * Registers an array of providers to the Ioc container. This
     * method will make use of the `appFile` to get the providers
     * list.
     *
     * @method _registerProviders
     *
     * @return {void}
     *
     * @private
     */
    private _registerProviders;
    /**
     * Boot providers
     *
     * @method _bootProviders
     *
     * @return {void}
     *
     * @async
     *
     * @private
     */
    private _bootProviders;
    /**
     * Define aliases for all providers.
     *
     * @method _defineAliases
     *
     * @return {void}
     *
     * @private
     */
    private _defineAliases;
    /**
     * Whether or not a preloaded file is part of
     * optional list
     *
     * @method _isOptional
     *
     * @param  {String}    filePath
     *
     * @return {Boolean}
     *
     * @private
     */
    private _isOptional;
    /**
     * Returns a boolean telling whether a file exists
     * or not
     *
     * @method _fileExists
     *
     * @param  {String}            filePath
     *
     * @return {Boolean}
     *
     * @private
     */
    private _fileExists;
    /**
     * Load all the files that are supposed to be preloaded
     *
     * @method _loadPreLoadFiles
     *
     * @return {void}
     *
     * @private
     */
    private _loadPreLoadFiles;
    /**
     * Conditionally loads the hooks file.
     *
     * @method _loadHooksFileIfAny
     *
     * @return {void}
     *
     * @private
     */
    private _loadHooksFileIfAny;
    /**
     * Registers the ace commands with ace module
     *
     * @method _registerCommands
     *
     * @return {void}
     *
     * @preserve
     */
    _registerCommands(): void;
    /**
     * Pretty prints the error to the terminal
     *
     * @method _printError
     *
     * @param  {Object}    error
     *
     * @return {void}
     *
     * @private
     */
    private _printError;
    /**
     * Start the http server using server and env
     * provider
     *
     * @param {Object} httpServerCallback
     *
     * @method _startHttpServer
     * @async
     *
     * @return {void}
     *
     * @private
     */
    private _startHttpServer;
    /**
     * Starts the websocket servers
     *
     * @method _startWsServer
     *
     * @param  {Http.Server}       httpServer
     *
     * @return {void}
     *
     * @private
     */
    private _startWsServer;
    /**
     * Invokes the ace command
     *
     * @method _invokeAce
     *
     * @return {void}
     *
     * @private
     */
    private _invokeAce;
    /**
     * Binds the listener to gracefully shutdown
     * the server
     *
     * @method _listenForSigEvents
     *
     * @return {void}
     *
     * @private
     */
    private _listenForSigEvents;
    /**
     * Binds a listener for `unhandledRejection` to make sure all promises
     * rejections are handled by the app
     *
     * @method _listenForUnhandledRejection
     *
     * @return {void}
     *
     * @private
     */
    private _listenForUnhandledRejection;
    /**
     * Preloads a file by appending it to the end
     * of the preloads list.
     *
     * @method preLoad
     *
     * @param  {String} filePath
     *
     * @chainable
     */
    preLoad(filePath: string): Ignitor;
    /**
     * Preload a file after a given file. If the `afterFile`
     * is not matched, the file is appended to the end
     * of the list.
     *
     * @method preLoadAfter
     *
     * @param  {String}     afterFilePath
     * @param  {String}     filePath
     *
     * @chainable
     */
    preLoadAfter(afterFilePath: string, filePath: string): Ignitor;
    /**
     * Prepend file to the list of preloads before a given
     * file.
     *
     * If the `afterFile` is not matched, the file is appended
     * to the end of the list.
     *
     * @method preLoadBefore
     *
     * @param  {String}      afterFilePath
     * @param  {String}      filePath
     *
     * @chainable
     */
    preLoadBefore(afterFilePath: string, filePath: string): Ignitor;
    /**
     * Set application app root
     *
     * @method appRoot
     *
     * @param  {String} location
     *
     * @chainable
     */
    appRoot(location: string): Ignitor;
    /**
     * Set application modules root. This path
     * contains the node_modules directory with
     * the application's dependencies.
     *
     * @method modulesRoot
     *
     * @param  {String} location
     *
     * @chainable
     */
    modulesRoot(location: string): Ignitor;
    /**
     * Set the application file. This file exports
     * an array of providers, aceProviders, aliases
     * and commands.
     *
     * @method appFile
     *
     * @param  {String} location
     *
     * @chainable
     */
    appFile(location: string): Ignitor;
    /**
     * Instructor ignitor to load and register
     * commands with ace before firing anything.
     *
     * @method loadCommands
     *
     * @chainable
     */
    loadCommands(): Ignitor;
    /**
     * Sets up fire by performing following
     * operations in sequence.
     *
     * 1. Register helpers.
     * 2. Load hooks file ( if any ).
     * 3. Register providers.
     * 4. Boot providers.
     * 5. Defined Aliases.
     * 6. Load files to be preload.
     * 7. Start http server.
     *
     * @method fire
     *
     * @return {void}
     *
     * @throws {Error} If app root has not be defined
     */
    fire(): void;
    /**
     * This method will instruct ignitor to run
     * the websocket server along with the
     * http server
     *
     * @method wsServer
     *
     * @param  {Http.Server} [httpServer]
     *
     * @chainable
     */
    wsServer(httpServer?: any): Ignitor;
    /**
     * Starts the Adonis http server.
     *
     * @method fireHttpServer
     *
     * @param {Function} httpServerCallback
     *
     * @return {void}
     */
    fireHttpServer(httpServerCallback: Function): void;
    /**
     * Runs the ace command
     *
     * @method fireAce
     *
     * @return {void}
     */
    fireAce(): void;
}
