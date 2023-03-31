export = MailProvider;
declare class MailProvider {
    /**
     * Register mail provider under `Adonis/Addons/Mail`
     * namespace
     *
     * @method _registerMail
     *
     * @return {void}
     *
     * @private
     */
    private _registerMail;
    /**
     * Register mail manager to expose the API to get
     * extended
     *
     * @method _registerMailManager
     *
     * @return {void}
     */
    _registerMailManager(): void;
    /**
     * Register bindings
     *
     * @method register
     *
     * @return {void}
     */
    register(): void;
}
