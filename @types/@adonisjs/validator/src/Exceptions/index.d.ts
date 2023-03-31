/**
 * Exception to throw when validation fails
 *
 * @class ValidationException
 */
export class ValidationException {
    static validationFailed(messages: any): ValidationException;
    /**
     * Handle the validation failed exception
     *
     * @method handle
     *
     * @param  {Array}  options.messages
     * @param  {Object} options.request
     * @param  {Object} options.response
     * @param  {Object} options.session
     *
     * @return {void}
     */
    handle({ messages }: any[], { request, response, session }: Object): void;
}
export declare const InvalidArgumentException: any;
