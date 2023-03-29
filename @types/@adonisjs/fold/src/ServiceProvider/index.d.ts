export = ServiceProvider;
/**
 * Service provider is the base class to be extended by all
 * the providers. Each provider can have register and boot
 * methods which are called by the Registrar class as
 * part of lifecycle hooks.
 *
 * @class ServiceProvider
 */
declare class ServiceProvider {
    constructor(Ioc: any);
    /**
     * Reference to the Ioc container
     * @attribute app
     */
    app: any;
}
