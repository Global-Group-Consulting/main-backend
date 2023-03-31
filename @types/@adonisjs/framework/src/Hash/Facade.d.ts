export = HashFacade;
/**
 * HashFacade is exposed by IoC container and it proxy
 * methods over @ref('Hash') class.
 *
 * @group Hash
 * @binding Adonis/Src/Hash
 * @alias Hash
 *
 * @class HashFacade
 * @constructor
 */
declare class HashFacade {
    constructor(Config: any);
    Config: any;
    _hasherInstances: {};
    /**
     * Returns the @ref('Hash') class instance for a given
     * driver.
     *
     * @method driver
     *
     * @param  {String}  name
     *
     * @return {Hash}
     */
    driver(name: string): Hash;
}
import Hash = require("./index");
