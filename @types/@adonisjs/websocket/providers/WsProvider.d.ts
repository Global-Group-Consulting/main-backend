export = WsProvider;
declare class WsProvider {
    /**
     * Register the Ws provider
     *
     * @method _registerWs
     *
     * @return {void}
     *
     * @private
     */
    private _registerWs;
    /**
     * Register the Ws context
     *
     * @method _registerWsContext
     *
     * @return {void}
     *
     * @private
     */
    private _registerWsContext;
    /**
     * Register all required providers
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * Add request getter to the WsContext
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
