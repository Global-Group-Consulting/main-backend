export = MigrationsProvider;
declare class MigrationsProvider {
    /**
     * Registering the schema class under
     * Adonis/Src/Schema namespace.
     *
     * @method _registerSchema
     *
     * @return {void}
     *
     * @private
     */
    private _registerSchema;
    /**
     * Registering the factory class under
     * Adonis/Src/Factory namespace.
     *
     * @method _registerFactory
     *
     * @return {void}
     *
     * @private
     */
    private _registerFactory;
    /**
     * Registers providers for all the migration related
     * commands
     *
     * @method _registerCommands
     *
     * @return {void}
     */
    _registerCommands(): void;
    /**
     * Registering the migration class under
     * Adonis/Src/Migration namespace.
     *
     * @method _registerMigration
     *
     * @return {void}
     *
     * @private
     */
    private _registerMigration;
    /**
     * Register all the required providers
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * On boot add commands with ace
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
