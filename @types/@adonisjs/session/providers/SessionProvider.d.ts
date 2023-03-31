export = SessionProvider;
declare class SessionProvider {
    /**
     * Registers manager under `Adonis/Src/Session`
     * namespace
     *
     * @method _registerManager
     *
     * @return {void}
     *
     * @private
     */
    private _registerManager;
    /**
     * Registers provider under `Adonis/Src/Session`
     * namespace.
     *
     * @method _registerProvider
     *
     * @return {void}
     *
     * @private
     */
    private _registerProvider;
    /**
     * Registers the session client under `Adonis/Clients/Session`
     * namespace
     *
     * @method _registerClient
     *
     * @return {void}
     */
    _registerClient(): void;
    /**
     * Register the middleware under `Adonis/Middleware/Session`
     * namespace
     *
     * @method _registerMiddleware
     *
     * @return {void}
     *
     * @private
     */
    private _registerMiddleware;
    /**
     * Register the vow trait to bind session client
     * under `Adonis/Traits/Session` namespace.
     *
     * @method _registerVowTrait
     *
     * @return {void}
     */
    _registerVowTrait(): void;
    /**
     * Register method called by ioc container
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * Boot the provider
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
