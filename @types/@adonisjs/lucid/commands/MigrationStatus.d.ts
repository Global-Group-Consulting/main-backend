export = MigrationStatus;
declare class MigrationStatus extends BaseMigration {
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
     * Method called when command is executed. This method
     * will print a table with the migrations status.
     *
     * @method handle
     *
     * @param  {Object} args
     * @param  {Boolean} options.keepAlive
     *
     * @return {void|Array}
     */
    handle(args: Object, { keepAlive }: boolean): void | any[];
}
import BaseMigration = require("./BaseMigration");
