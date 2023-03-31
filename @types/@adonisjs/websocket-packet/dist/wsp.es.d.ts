export default index;
declare var index: {
    codes: Object;
} & typeof fns;
declare namespace fns {
    /**
     * Finding if a packet has a topic.
     *
     * @method hasTopic
     *
     * @param  {Object}  packet
     *
     * @return {Boolean}
     */
    export function hasTopic(packet: Object): boolean;
    import isValidJoinPacket = hasTopic;
    export { isValidJoinPacket };
    import isValidLeavePacket = hasTopic;
    export { isValidLeavePacket };
    import isValidEventPacket = hasTopic;
    export { isValidEventPacket };
    /**
     * Makes a join packet
     *
     * @method joinPacket
     *
     * @param  {String}   topic
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or not a string
     */
    export function joinPacket(topic: string): Object;
    /**
     * Makes a leave packet
     *
     * @method leavePacket
     *
     * @param  {String}    topic
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or not a string
     */
    export function leavePacket(topic: string): Object;
    /**
     * Makes join acknowledge packet
     *
     * @method joinAckPacket
     *
     * @param  {String}     topic
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or is not a string
     */
    export function joinAckPacket(topic: string): Object;
    /**
     * Makes join error packet
     *
     * @method joinErrorPacket
     *
     * @param  {String}        topic
     * @param  {String}        message
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or not a string
     * @throws {Error} If message is not defined or not a string
     */
    export function joinErrorPacket(topic: string, message: string): Object;
    /**
     * Makes leave packet
     *
     * @method leaveAckPacket
     *
     * @param  {String}       topic
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or not a string
     */
    export function leaveAckPacket(topic: string): Object;
    /**
     * Makes leave error packet
     *
     * @method leaveErrorPacket
     *
     * @param  {String}         topic
     * @param  {String}         message
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or not a string
     * @throws {Error} If message is not defined or not a string
     */
    export function leaveErrorPacket(topic: string, message: string): Object;
    /**
     * Makes the event packet
     *
     * @method eventPacket
     *
     * @param  {String}    topic
     * @param  {String}    event
     * @param  {Mixed}     data
     *
     * @return {Object}
     *
     * @throws {Error} If topic is not defined or not a string
     * @throws {Error} If event is not defined
     * @throws {Error} If data is not defined
     */
    export function eventPacket(topic: string, event: string, data: Mixed): Object;
    /**
     * Makes ping packet
     *
     * @method pingPacket
     *
     * @return {Object}
     */
    export function pingPacket(): Object;
    /**
     * Makes pong packet
     *
     * @method pongPacket
     *
     * @return {Object}
     */
    export function pongPacket(): Object;
}
