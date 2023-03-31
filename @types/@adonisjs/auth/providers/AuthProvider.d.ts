export = AuthProvider;
declare class AuthProvider {
    /**
     * Register auth provider under `Adonis/Src/Auth` namespace
     *
     * @method _registerAuth
     *
     * @return {void}
     *
     * @private
     */
    private _registerAuth;
    /**
     * Register auth manager under `Adonis/Src/Auth` namespace
     *
     * @method _registerAuthManager
     *
     * @return {void}
     *
     * @private
     */
    private _registerAuthManager;
    /**
     * Register authinit middleware under `Adonis/Middleware/AuthInit`
     * namespace.
     *
     * @method _registerAuthInitMiddleware
     *
     * @return {void}
     */
    _registerAuthInitMiddleware(): void;
    /**
     * Register auth middleware under `Adonis/Middleware/Auth` namespace.
     *
     * @method _registerAuthMiddleware
     *
     * @return {void}
     *
     * @private
     */
    private _registerAuthMiddleware;
    /**
     * Register AllowGuestOnly middleware under `Adonis/Middleware/AllowGuestOnly` namespace.
     *
     * @method _registerAllowGuestOnlyMiddleware
     *
     * @return {void}
     *
     * @private
     */
    private _registerAllowGuestOnlyMiddleware;
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
     * Register namespaces to the IoC container
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * Attach context getter when all providers have
     * been registered
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
