export = AntlProvider;
declare class AntlProvider {
    /**
     * Register the facade under `Adonis/Addons/Antl`
     * namespace
     *
     * @method _registerAntlFacade
     *
     * @return {void}
     *
     * @private
     */
    private _registerAntlFacade;
    /**
     * Register antl manager under `Adonis/Addons/Antl`
     * namespace
     *
     * @method _registerAntlManager
     *
     * @return {void}
     *
     * @private
     */
    private _registerAntlManager;
    /**
     * Register formats to the IoC container as
     * `Adonis/Addons/AntlFormats` binding
     *
     * @method _registerFormats
     *
     * @return {void}
     *
     * @private
     */
    private _registerFormats;
    /**
     * Returns the first argv from the argvs list
     *
     * @method _getFirstArg
     *
     * @return {String}
     *
     * @private
     */
    private _getFirstArg;
    /**
     * Register bindings
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * On boot, boot the default loader
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
