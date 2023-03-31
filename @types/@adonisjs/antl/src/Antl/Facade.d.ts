export = AntlFacade;
/**
 * Antl facade class is binded to the IoC container
 * and works as a facade. This class wires up
 * the loader with the Antl class.
 *
 * @class AntlFacade
 * @binding Adonis/Addons/Antl
 * @alias Antl
 * @singleton true
 */
declare class AntlFacade {
    constructor(Config: any);
    _config: any;
    /**
     * Memory store to keep all locales
     * for booted drivers
     *
     * @type {Object}
     */
    _store: Object;
    /**
     * Returns the default locale from
     * the config file
     *
     * @method defaultLocale
     *
     * @return {String}
     */
    defaultLocale(): string;
    /**
     * Boots the loader and pull messages from
     * it into memory
     *
     * @method bootLoader
     *
     * @param {String} name
     *
     * @return {void}
     */
    bootLoader(name: string): void;
    /**
     * Returns the instance for a selected
     * or default loader
     *
     * @method loader
     *
     * @param  {String} name
     *
     * @return {Antl}
     */
    loader(name: string): Antl;
}
import Antl = require(".");
