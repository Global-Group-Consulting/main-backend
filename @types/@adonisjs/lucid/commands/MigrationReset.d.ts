export = MigrationReset;
declare class MigrationReset extends BaseMigration {
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
     * and rollback to the first batch
     *
     * @method handle
     *
     * @param  {Object} args
     * @param  {Boolean} options.log
     * @param  {Boolean} options.force
     * @param  {Boolean} options.silent
     * @param  {Boolean} options.keepAlive
     *
     * @return {void|Array}
     */
    handle(args: Object, { log, force, silent, keepAlive }: boolean): void | any[];
}
import BaseMigration = require("./BaseMigration");
