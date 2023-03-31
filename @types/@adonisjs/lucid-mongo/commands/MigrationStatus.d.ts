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
     * @return {void|Array}
     */
    handle(): void | any[];
}
import BaseMigration = require("./BaseMigration");
