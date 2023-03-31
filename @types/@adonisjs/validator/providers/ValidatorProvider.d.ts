export = ValidationProvider;
declare class ValidationProvider {
    /**
     * Register the validator to the IoC container
     * with `Adonis/Addons/Validator` namespace.
     *
     * @method _registerValidator
     *
     * @return {void}
     *
     * @private
     */
    private _registerValidator;
    /**
     * Register the middleware to the IoC container
     * with `Adonis/Middleware/Validator` namespace
     *
     * @method _registerMiddleware
     *
     * @return {void}
     *
     * @private
     */
    private _registerMiddleware;
    /**
     * Register the `make:validator` command to the IoC container
     *
     * @method _registerCommands
     *
     * @return {void}
     *
     * @private
     */
    private _registerCommands;
    /**
     * Register bindings
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * On boot
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
