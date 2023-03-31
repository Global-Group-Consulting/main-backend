export = FileLoader;
/**
 * File loader loads the messages from the file-system
 *
 * @class FileLoader
 * @constructor
 */
declare class FileLoader {
    /**
     * Ioc Container injections
     *
     * @attribute inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    constructor(Helpers: any);
    Helpers: any;
    _config: ({
        localesDir: any;
    } & Object) | null;
    /**
     * Sets the config, called by Antl manager. It is done
     * so that each loader should own it's constructor
     *
     * @method setConfig
     *
     * @param  {Object}  config
     */
    setConfig(config: Object): void;
    /**
     * Reloads the new locales from the file-system. This
     * method is same as `load`. Since loader API
     * needs to implement both methods, for file
     * loader this method is just an alias.
     *
     * @method reload
     *
     * @return {Object}
     */
    reload(): Object;
    /**
     * Loads all the locales from the file system.
     *
     * @method load
     *
     * @return {Object}
     */
    load(): Object;
}
