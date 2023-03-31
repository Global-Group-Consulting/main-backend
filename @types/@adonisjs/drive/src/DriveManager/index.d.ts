declare const _exports: DriveManager;
export = _exports;
declare class DriveManager {
    drivers: {};
    /**
     * Extend by adding a new driver
     *
     * @method extend
     *
     * @param  {String} name
     * @param  {Class} implementation
     *
     * @chainable
     */
    extend(name: string, implementation: Class): DriveManager;
}
