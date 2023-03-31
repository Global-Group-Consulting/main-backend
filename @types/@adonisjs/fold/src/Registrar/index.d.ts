export = Registrar;
/**
 * Registrar class is used to register and boot providers. This
 * should be done once and at the time of booting the app.
 *
 * @class Registrar
 */
declare class Registrar {
    constructor(Ioc: any);
    Ioc: any;
    _providers: any[];
    /**
     * Listen for registrar specific events
     *
     * @method on
     *
     * @param {string} name
     * @param {function} callback
     */
    on(name: string, callback: Function): void;
    /**
     * Listen for registrar specific events
     * just for one time
     *
     * @method once
     *
     * @param {string} name
     * @param {function} callback
     */
    once(name: string, callback: Function): void;
    /**
     * Remove a listener
     *
     * @method removeListener
     *
     * @param {string} name
     * @param {function} callback
     */
    removeListener(name: string, callback: Function): void;
    /**
     * Event fires when all providers have been
     * registered
     *
     * @event providers:registered
     */
    get PROVIDERS_REGISTERED(): string;
    /**
     * Event fires when all providers have been
     * booted.
     *
     * @event providers:booted
     */
    get PROVIDERS_BOOTED(): string;
    /**
     * Loop over providers array and returns an instance
     * of each provider class. It will also require
     * the files in the process.
     *
     * @private
     *
     * @method _getProvidersInstance
     *
     * @param {Array} arrayOfProviders
     *
     * @return {Array}
     */
    private _getProvidersInstance;
    /**
     * Registers the providers by calling register method on
     * them. Providers that does not contain the register
     * method will be skipped.
     *
     * @private
     *
     * @method _registerProviders
     *
     * @param {Array} providers
     */
    private _registerProviders;
    /**
     * Boots the providers by calling boot method on them.
     * Providers that does have the boot method will be
     * skipped.
     *
     * @private
     *
     * @method _bootProviders
     *
     * @param {Array} providers
     *
     * @return {Promise}
     */
    private _bootProviders;
    /**
     * Setting providers that will later be registered
     * and booted.
     *
     * @method providers
     *
     * @param  {Array} arrayOfProviders
     *
     * @chainable
     */
    providers(arrayOfProviders: any[]): Registrar;
    /**
     * Register providers earlier defined via the
     * `providers` method.
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * Boot providers earlier defined via the
     * `providers` method.
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
    /**
     * Register and boot providers together
     *
     * @method registerAndBoot
     *
     * @return {void}
     */
    registerAndBoot(): void;
}
