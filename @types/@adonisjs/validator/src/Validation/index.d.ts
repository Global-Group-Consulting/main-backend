export = Validation;
/**
 * Validation class to validate data with a rules
 * schema.
 *
 * @class Validation
 * @constructor
 */
declare class Validation {
    constructor(data: any, rules: any, messages: any, formatter: any);
    _data: any;
    _rules: any;
    _messages: any;
    _formatter: any;
    _errorMessages: any[] | null;
    _executed: boolean;
    /**
     * Sets the error as a property on instance.
     *
     * @method _useErrors
     *
     * @param  {Array}   errors
     *
     * @return {void}
     */
    _useErrors(errors: any[]): void;
    /**
     * Marks the validation as executed, also makes sure
     * that not re-executing the validations
     *
     * @method _markAsExecuted
     *
     * @return {void}
     */
    _markAsExecuted(): void;
    /**
     * Run validation on data using defined rules
     *
     * @method run
     *
     * @return {this}
     */
    run(): this;
    /**
     * Run all validations, regardless of failures. The `run`
     * method on the opposite side stops at the first
     * validation
     *
     * @method runAll
     *
     * @return {this}
     */
    runAll(): this;
    /**
     * Returns an array of validation messages
     * or null, if there are no errors
     *
     * @method messages
     *
     * @return {Array|Null}
     */
    messages(): any[] | null;
    /**
     * Returns a boolean indicating if there are
     * validation errors
     *
     * @method fails
     *
     * @return {Boolean}
     */
    fails(): boolean;
}
