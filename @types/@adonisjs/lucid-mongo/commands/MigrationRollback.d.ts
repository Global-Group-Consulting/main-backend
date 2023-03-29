export = MirationRollback;
declare class MirationRollback extends BaseMigration {
    /**
     * Command signature required by ace
     *
     * @method signature
     *
     * @return {String}
     */
    static get signature(): string;
    /**
     * Command description
     *
     * @method description
     *
     * @return {String}
     */
    static get description(): string;
    /**
     * Method called when command is executed. This method will
     * require all files from the migrations directory
     * and rollback to a specific batch
     *
     * @method handle
     *
     * @param  {Object} args
     * @param  {Boolean} options.log
     * @param  {Boolean} options.force
     * @param  {Number} options.batch
     * @param  {Boolean} options.silent
     *
     * @return {void|Array}
     */
    handle(args: Object, { log, force, batch, silent }: boolean): void | any[];
}
import BaseMigration = require("./BaseMigration");
