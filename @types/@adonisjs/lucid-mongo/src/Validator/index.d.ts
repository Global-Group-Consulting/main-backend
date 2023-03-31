export = ValidatorRules;
/**
 * This class exposes the validator rules
 * related to database
 */
declare class ValidatorRules {
    constructor(Database: any);
    Database: any;
    /**
     * Verify whether a field inside the database is unique
     * or not.
     *
     * @method unique
     *
     * @param  {Object} data
     * @param  {String} field
     * @param  {String} message
     * @param  {Array} args
     * @param  {Function} get
     *
     * @return {Promise}
     *
     * @example
     * ```js
     * email: 'unique:users' // define table
     * email: 'unique:users,user_email' // define table + field
     * email: 'unique:users,user_email,id:1' // where id !== 1
     *
     * // Via new rule method
     * email: [rule('unique', ['users', 'user_email', 'id', 1])]
     * ```
     */
    unique(data: Object, field: string, message: string, args: any[], get: Function): Promise<any>;
}
