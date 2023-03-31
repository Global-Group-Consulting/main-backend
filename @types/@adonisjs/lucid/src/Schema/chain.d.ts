export = SchemaChain;
declare class SchemaChain {
    _deferredActions: any[];
    _scheduleFn: Function | null;
    /**
     * Select schema to be used with postgreSQL.
     *
     * @method withSchema
     *
     * @param {String} schema
     *
     * @chainable
     */
    withSchema(schema: string): SchemaChain;
    /**
     * Create a extension.
     *
     * NOTE: This action is deferred
     *
     * @method createExtension
     *
     * @param  {String}    extensionName
     *
     * @return {void}
     */
    createExtension(extensionName: string): void;
    /**
     * Create a extension if not already exists.
     *
     * NOTE: This action is deferred
     *
     * @method createExtensionIfNotExists
     *
     * @param  {String}    extensionName
     *
     * @return {void}
     */
    createExtensionIfNotExists(extensionName: string): void;
    /**
     * Create a new table.
     *
     * NOTE: This action is deferred
     *
     * @method createTable
     *
     * @param  {String}    tableName
     * @param  {Function}  callback
     *
     * @return {void}
     */
    createTable(tableName: string, callback: Function): void;
    /**
     * Create a new table if not already exists.
     *
     * NOTE: This action is deferred
     *
     * @method createTableIfNotExists
     *
     * @param  {String}    tableName
     * @param  {Function}  callback
     *
     * @return {void}
     */
    createTableIfNotExists(tableName: string, callback: Function): void;
    /**
     * Rename existing table.
     *
     * NOTE: This action is deferred
     *
     * @method renameTable
     *
     * @param  {String}    fromTable
     * @param  {String}    toTable
     *
     * @return {void}
     */
    renameTable(fromTable: string, toTable: string): void;
    /**
     * Drop existing extension.
     *
     * NOTE: This action is deferred
     *
     * @method dropExtension
     *
     * @param  {String}    extensionName
     *
     * @return {void}
     */
    dropExtension(extensionName: string): void;
    /**
     * Drop extension only if it exists.
     *
     * NOTE: This action is deferred
     *
     * @method dropExtensionIfExists
     *
     * @param  {String}    extensionName
     *
     * @return {void}
     */
    dropExtensionIfExists(extensionName: string): void;
    /**
     * Drop existing table.
     *
     * NOTE: This action is deferred
     *
     * @method dropTable
     *
     * @param  {String}    tableName
     *
     * @return {void}
     */
    dropTable(tableName: string): void;
    /**
     * Drop table only if it exists.
     *
     * NOTE: This action is deferred
     *
     * @method dropTableIfExists
     *
     * @param  {String}    tableName
     *
     * @return {void}
     */
    dropTableIfExists(tableName: string): void;
    /**
     * Select table for altering it.
     *
     * NOTE: This action is deferred
     *
     * @method table
     *
     * @param  {String}    tableName
     * @param  {Function}  callback
     *
     * @return {void}
     */
    table(tableName: string, callback: Function): void;
    /**
     * Run a raw SQL statement
     *
     * @method raw
     *
     * @param  {String} statement
     *
     * @return {Object}
     *
     * @return {void}
     */
    raw(statement: string): Object;
    /**
     * Schedule a method to be executed in sequence with migrations
     *
     * @method schedule
     *
     * @param  {Function} fn
     *
     * @return {void}
     */
    schedule(fn: Function): void;
    /**
     * Alias for @ref('Schema.table')
     *
     * @method alter
     */
    alter(...args: any[]): void;
    /**
     * Alias for @ref('Schema.createTable')
     *
     * @method create
     */
    create(...args: any[]): void;
    /**
     * Alias for @ref('Schema.createTableIfNotExists')
     *
     * @method createIfNotExists
     */
    createIfNotExists(...args: any[]): void;
    /**
     * Alias for @ref('Schema.dropTable')
     *
     * @method drop
     */
    drop(...args: any[]): void;
    /**
     * Alias for @ref('Schema.dropTableIfExists')
     *
     * @method dropIfExists
     */
    dropIfExists(...args: any[]): void;
    /**
     * Alias for @ref('Schema.renameTable')
     *
     * @method rename
     */
    rename(...args: any[]): void;
    /**
     * Returns the SQL query for all the actions.
     *
     * @method toString
     *
     * @return {String}
     */
    toString(schema: any): string;
    /**
     * Executes the deferred actions on a single chain. This method will
     * rollback the trx on error.
     *
     * @method execute
     *
     * @param  {Object} trx
     *
     * @return {void}
     */
    execute(trx: Object): void;
}
