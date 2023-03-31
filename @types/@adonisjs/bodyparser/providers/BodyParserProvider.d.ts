export = BodyParserProvider;
declare class BodyParserProvider {
    /**
     * Defines the request macro to get an instance of
     * file.
     *
     * @method _defineRequestMacro
     *
     * @return {void}
     *
     * @private
     */
    private _defineRequestMacro;
    /**
     * Extends the validator by adding file related validations. Only when
     * validator is used by the app
     *
     * @method _registerValidatorBindings
     *
     * @return {void}
     *
     * @private
     */
    private _registerValidatorBindings;
    /**
     * The boot method called by ioc container
     * as a life-cycle method
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
    /**
     * The register method called by ioc container
     * as a life-cycle method
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
}
