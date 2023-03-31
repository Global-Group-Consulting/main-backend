/**
 * This class contains static methods to throw exceptions
 * when unable to move file due to some unexpected
 * reasons.
 *
 * @class FileMoveException
 * @constructor
 */
export class FileMoveException {
    /**
     * This exception is thrown when user is trying to move
     * file to the `tmp` directory for multiple times.
     *
     * Exception code `E_CANNOT_MOVE`
     *
     * @method multipleMoveAttempts
     *
     * @param  {String}             fieldname
     *
     * @return {Object}
     */
    static multipleMoveAttempts(fieldname: string): Object;
    /**
     * This exception is thrown when user is trying to call `move`
     * for multiple times, or maybe used the stream manually
     * and now calling the move method.
     *
     * Exception code `E_CANNOT_MOVE`
     *
     * @method invalidMoveState
     *
     * @param  {String}         fieldname
     *
     * @return {Object}
     */
    static invalidMoveState(fieldname: string): Object;
}
