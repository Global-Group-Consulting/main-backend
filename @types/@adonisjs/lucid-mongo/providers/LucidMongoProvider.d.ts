export = LucidMongoProvider;
declare class LucidMongoProvider {
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
     * Registering the serializer for auth
     */
    _registerSerializer(): void;
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
