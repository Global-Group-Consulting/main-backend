export = MakeValidator;
/**
 * Command to create a validator
 *
 * @class MakeValidator
 * @constructor
 */
declare class MakeValidator {
    /**
     * IoC container injections
     *
     * @method inject
     *
     * @return {Array}
     */
    static get inject(): any[];
    /**
     * The command signature
     *
     * @method signature
     *
     * @return {String}
     */
    static get signature(): string;
    /**
     * The command description
     *
     * @method description
     *
     * @return {String}
     */
    static get description(): string;
    constructor(Helpers: any);
    Helpers: any;
    /**
     * Method called when command is executed
     *
     * @method handle
     *
     * @param  {String} options.name
     *
     * @return {void}
     */
    handle({ name }: string): void;
}
