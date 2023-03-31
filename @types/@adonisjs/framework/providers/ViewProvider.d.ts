export = ViewProvider;
declare class ViewProvider {
    /**
     * Register method called by the Ioc container
     * to register the provider
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * Boot method called by the Ioc container to
     * boot the provider
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
