export = LucidProvider;
declare class LucidProvider {
    /**
     * Registering the database manager under
     * Adonis/Src/Database namespace.
     *
     * @method _registerDatabase
     *
     * @return {void}
     *
     * @private
     */
    private _registerDatabase;
    /**
     * Registering the lucid model under
     * Adonis/Src/Model namespace.
     *
     * @method _registerModel
     *
     * @return {void}
     *
     * @private
     */
    private _registerModel;
    /**
     * Register transactions trait under `Adonis/Traits/DatabaseTransactions`
     * namespace. Supposed to be used when writing tests.
     *
     * @method _registerTransactionsTrait
     *
     * @return {void}
     *
     * @private
     */
    private _registerTransactionsTrait;
    /**
     * Adds the unique rule to the validator
     *
     * @method _addUniqueRule
     *
     * @private
     */
    private _addUniqueRule;
    /**
     * Register all the required providers
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
    /**
     * Boot the provider
     *
     * @method boot
     *
     * @return {void}
     */
    boot(): void;
}
