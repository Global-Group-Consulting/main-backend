export = InvalidArgumentException;
/**
 * Invalid argument exception is thrown when methods or functions
 * arguments are missing or wrong.
 *
 * @class InvalidArgumentException
 */
declare class InvalidArgumentException {
    static get repo(): string;
    /**
     * Throw an exception when there is a missing parameter
     *
     * @method missingParameter
     * @static
     *
     * @param  {String}         method
     * @param  {String}         parameterName
     * @param  {String|Number}  position
     *
     * @return {InvalidArgumentException}
     */
    static missingParameter(method: string, parameterName: string, position: string | number): InvalidArgumentException;
    /**
     * Throw exception when the parameter received is invalid
     *
     * @method invalidParameter
     * @static
     *
     * @param  {String}         errorMessage
     * @param  {Mixed}          originalValue
     *
     * @return {InvalidArgumentException}
     */
    static invalidParameter(errorMessage: string, originalValue: Mixed): InvalidArgumentException;
    /**
     * Invoke instance of this class with a custom message
     * status and error code
     *
     * @method invoke
     *
     * @param  {String} message
     * @param  {Number} [status = 500]
     * @param  {String} [code = E_INVALID_ARGUMENT]
     *
     * @return {InvalidArgumentException}
     */
    static invoke(message: string, status?: number | undefined, code?: string | undefined): InvalidArgumentException;
}
