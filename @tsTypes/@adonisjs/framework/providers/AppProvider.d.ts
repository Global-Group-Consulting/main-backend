export = AppProvider;
declare class AppProvider {
    /**
     * Registering the env provider under
     * Adonis/Src/Env namespace.
     *
     * @method _registerEnv
     *
     * @return {void}
     *
     * @private
     */
    private _registerEnv;
    /**
     * Registering the config provider under
     * Adonis/Src/Config namespace
     *
     * @method _registerConfig
     *
     * @return {void}
     *
     * @private
     */
    private _registerConfig;
    /**
     * Registering the request provider under
     * Adonis/Src/Request namespace
     *
     * @method _registerRequest
     *
     * @return {void}
     *
     * @private
     */
    private _registerRequest;
    /**
     * Registering the response provider under
     * Adonis/Src/Response namespace
     *
     * @method _registerResponse
     *
     * @return {void}
     *
     * @private
     */
    private _registerResponse;
    /**
     * Registering the route provider under
     * Adonis/Src/Route namespace
     *
     * @method _registerRoute
     *
     * @return {void}
     *
     * @private
     */
    private _registerRoute;
    /**
     * Registers the logger provider under
     * Adonis/Src/Logger namespace
     *
     * @method _registerLogger
     *
     * @return {void}
     */
    _registerLogger(): void;
    /**
     * Register logger manager under `Adonis/Src/Logger` namespace
     *
     * @method _registerLoggerManager
     *
     * @return {void}
     *
     * @private
     */
    private _registerLoggerManager;
    /**
     * Register the server provider under
     * Adonis/Src/Server namespace.
     *
     * @method _registerServer
     *
     * @return {void}
     *
     * @private
     */
    private _registerServer;
    /**
     * Registers the hash provider
     *
     * @method _registerHash
     *
     * @return {void}
     *
     * @private
     */
    private _registerHash;
    /**
     * Register hash manager under `Adonis/Src/Hash` namespace
     *
     * @method _registerHashManager
     *
     * @return {void}
     *
     * @private
     */
    private _registerHashManager;
    /**
     * Register the context provider
     *
     * @method _registerContext
     *
     * @return {void}
     *
     * @private
     */
    private _registerContext;
    /**
     * Register the static resource middleware provider
     *
     * @method _registerStaticMiddleware
     *
     * @return {void}
     *
     * @private
     */
    private _registerStaticMiddleware;
    /**
     * Registers the exceptions provider
     *
     * @method _registerException
     *
     * @return {void}
     */
    _registerException(): void;
    /**
     * Register the exception handler
     *
     * @method _registerExceptionHandler
     *
     * @return {void}
     *
     * @private
     */
    private _registerExceptionHandler;
    /**
     * Register the encryption provider
     *
     * @method _registerEncryption
     *
     * @return {void}
     */
    _registerEncryption(): void;
    /**
     * Registers the event provider under `Adonis/Src/Event`
     * namespace.
     *
     * @method _registerEvent
     *
     * @return {void}
     */
    _registerEvent(): void;
    /**
     * Registers a hash trait to be used while running
     * tests, which simply binds the hash mock
     * to the ioc container.
     *
     * @method _registerHashTrait
     *
     * @return {void}
     *
     * @private
     */
    private _registerHashTrait;
    /**
     * Register all the required providers
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * The boot method called by Ioc container to
     * boot the providers
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
