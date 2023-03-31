export = ValidatorMiddleware;
/**
 * The middleware to validate requests using a custom
 * validator.
 *
 * This middleware is wrapped inside `Route.validator()` method
 * which automatically pushes this middleware in the route
 * middleware stack
 *
 * @namespace Adonis/Middleware/ValidatorMiddleware
 *
 * @class ValidatorMiddleware
 * @constructor
 */
declare class ValidatorMiddleware {
    constructor(Validator: any);
    Validator: any;
    /**
     * Sanitize user data based upon validator sanitization
     * rules
     *
     * @method _sanitizeData
     *
     * @param  {Object}      request
     * @param  {Object}      validatorInstance
     *
     * @return {void}
     *
     * @private
     */
    private _sanitizeData;
    /**
     * Runs validations on the current request data using
     * the validator instance.
     *
     * @method _runValidations
     * @async
     *
     * @param  {Object}        ctx
     * @param  {Object}        validatorInstance
     *
     * @return {Boolean}
     *
     * @throws {ValidationException} If validation fails and there is no `fails` method
     *                               on the validatorInstance
     *
     * @private
     */
    private _runValidations;
    /**
     * Calls the validator authorize method when it exists
     *
     * @method _authorize
     *
     * @param  {Object}   validatorInstance
     *
     * @return {Boolean}
     *
     * @private
     */
    private _authorize;
    /**
     * Ends the response when it's pending and the end-user
     * has not made any response so far.
     *
     * @method _endResponseIfCan
     *
     * @param  {Object}          response
     * @param  {String}          message
     * @param  {Number}          status
     *
     * @return {void}
     *
     * @private
     */
    private _endResponseIfCan;
    /**
     * Handle method executed by adonis middleware chain
     *
     * @method handle
     *
     * @param  {Object}   ctx
     * @param  {Function} next
     * @param  {Array}   validator
     *
     * @return {void}
     */
    handle(ctx: Object, next: Function, validator: any[]): void;
}
