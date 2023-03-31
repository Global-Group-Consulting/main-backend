/**
 * Bind listener to listen for process message
 *
 * @method init
 *
 * @return {void}
 */
export function init(): void;
/**
 * Bind listener to listen for process message
 *
 * @method init
 *
 * @return {void}
 */
export function init(): void;
/**
 * Sends a message out from the process. The cluster should bind
 * listener for listening messages.
 *
 * @method send
 *
 * @param  {String} handle
 * @param  {String} topic
 * @param  {Object} payload
 *
 * @return {void}
 */
export function send(handle: string, topic: string, payload: Object): void;
/**
 * Sends a message out from the process. The cluster should bind
 * listener for listening messages.
 *
 * @method send
 *
 * @param  {String} handle
 * @param  {String} topic
 * @param  {Object} payload
 *
 * @return {void}
 */
export function send(handle: string, topic: string, payload: Object): void;
/**
 * Clear up event listeners
 *
 * @method destroy
 *
 * @return {void}
 */
export function destroy(): void;
/**
 * Clear up event listeners
 *
 * @method destroy
 *
 * @return {void}
 */
export function destroy(): void;
