export = Persona;
/**
 * The personna class is used to manage the user profile
 * creation, verification and updation with ease.
 *
 * @class Persona
 *
 * @param {Object} Config
 * @param {Object} Validator
 * @param {Object} Event
 * @param {Object} Hash
 */
declare class Persona {
    constructor(Config: any, Validator: any, Event: any, Encryption: any, Hash: any);
    config: any;
    /**
     * Varients of password fields
     */
    _oldPasswordField: string;
    _passwordConfirmationField: string;
    Hash: any;
    Event: any;
    Validator: any;
    _encrypter: any;
    _model: any;
    /**
     * Returns the email value from an object
     *
     * @method _getEmail
     *
     * @param  {Object}      payload
     *
     * @return {String}
     *
     * @private
     */
    private _getEmail;
    /**
     * Returns the password value from an object
     *
     * @method _getPassword
     *
     * @param  {Object}         payload
     *
     * @return {String}
     *
     * @private
     */
    private _getPassword;
    /**
     * Updates email field value on an object
     *
     * @method _setEmail
     *
     * @param  {Object}  payload
     * @param  {String}  email
     *
     * @private
     */
    private _setEmail;
    /**
     * Sets password field value on an object
     *
     * @method _setPassword
     *
     * @param  {Object}     payload
     * @param  {String}     password
     *
     * @private
     */
    private _setPassword;
    /**
     * Makes the custom message for a given key
     *
     * @method _makeCustomMessage
     *
     * @param  {String}           key
     * @param  {Object}           data
     * @param  {String}           defaultValue
     *
     * @return {String}
     *
     * @private
     */
    private _makeCustomMessage;
    /**
     * Adds query constraints to pull the right token
     *
     * @method _addTokenConstraints
     *
     * @param  {Object}            query
     * @param  {String}            type
     *
     * @private
     */
    private _addTokenConstraints;
    /**
     * Generates a new token for a user and given type. Ideally
     * tokens will be for verifying email and forgot password
     *
     * @method generateToken
     *
     * @param  {Object}      user
     * @param  {String}      type
     *
     * @return {String}
     *
     * @example
     * ```
     * const user = await User.find(1)
     * const token = await Persona.generateToken(user, 'email')
     * ```
     */
    generateToken(user: Object, type: string): string;
    /**
     * Returns the token instance along with releated
     * users
     *
     * @method getToken
     *
     * @param  {String} token
     * @param  {String} type
     *
     * @return {Object|Null}
     *
     * @example
     * ```
     * const token = request.input('token')
     * const tokenRow = await Persona.getToken(token, 'email')
     *
     * if (!tokenRow) {
     *   // token is invalid or expired
     * }
     *
     * const user = tokenRow.getRelated('user')
     * ```
     */
    getToken(token: string, type: string): Object | null;
    /**
     * Remvoes the token from the tokens table
     *
     * @method removeToken
     *
     * @param  {String}    token
     * @param  {String}    type
     *
     * @return {void}
     */
    removeToken(token: string, type: string): void;
    /**
     * Returns the model class
     *
     * @method getModel
     *
     * @return {Model}
     */
    getModel(): Model;
    /**
     * Returns an object of messages to be used for validation
     * failures
     *
     * @method getMessages
     *
     * @param {String} action
     *
     * @return {Object}
     */
    getMessages(action: string): Object;
    /**
     * Returns the table in user
     *
     * @method getTable
     *
     * @return {String}
     */
    getTable(): string;
    /**
     * Returns an object of registeration rules
     *
     * @method registerationRules
     *
     * @return {Object}
     */
    registerationRules(): Object;
    /**
     * Returns the validation rules for updating email address
     *
     * @method updateEmailRules
     *
     * @param  {String}         userId
     *
     * @return {Object}
     */
    updateEmailRules(userId: string): Object;
    /**
     * Returns the validation rules for updating the passowrd
     *
     * @method updatePasswordRules
     *
     * @param {Boolean} enforceOldPassword
     *
     * @return {Object}
     */
    updatePasswordRules(enforceOldPassword?: boolean): Object;
    /**
     * Returns an object of loginRules
     *
     * @method loginRules
     *
     * @return {String}
     */
    loginRules(): string;
    /**
     * Mutates the registeration payload in the shape that
     * can be inserted to the database
     *
     * @method massageRegisterationData
     *
     * @param  {Object}                 payload
     *
     * @return {void}
     */
    massageRegisterationData(payload: Object): void;
    /**
     * Runs validations using the validator and throws error
     * if validation fails
     *
     * @method runValidation
     *
     * @param  {Object}      payload
     * @param  {Object}      rules
     * @param  {String}      action
     *
     * @return {void}
     *
     * @throws {ValidationException} If validation fails
     */
    runValidation(payload: Object, rules: Object, action: string): void;
    /**
     * Verifies two password and throws exception when they are not
     * valid
     *
     * @method verifyPassword
     *
     * @param  {String}       newPassword
     * @param  {String}       oldPassword
     * @param  {String}       [field = this.config.password]
     *
     * @return {void}
     */
    verifyPassword(newPassword: string, oldPassword: string, field?: string | undefined): void;
    /**
     * Finds the user by looking for any of the given uids
     *
     * @method getUserByUids
     *
     * @param  {String}      value
     *
     * @return {Object}
     */
    getUserByUids(value: string): Object;
    /**
     * Creates a new user account and email verification token
     * for them.
     *
     * This method will fire `user::created` event.
     *
     * @method register
     *
     * @param  {Object}   payload
     * @param  {Function} callback
     *
     * @return {User}
     *
     * @example
     * ```js
     * const payload = request.only(['email', 'password', 'password_confirmation'])
     * await Persona.register(payload)
     * ```
     */
    register(payload: Object, callback: Function): User;
    /**
     * Verifies user credentials
     *
     * @method verify
     *
     * @param  {Object} payload
     * @param  {Function} callback
     *
     * @return {User}
     *
     * @example
     * ```js
     * const payload = request.only(['uid', 'password'])
     * await Persona.verify(payload)
     * ```
     */
    verify(payload: Object, callback: Function): User;
    /**
     * Verifies the user email address using a unique
     * token associated to their account
     *
     * @method verifyEmail
     *
     * @param  {String}    token
     *
     * @return {User}
     *
     * @example
     * ```js
     * const token = request.input('token')
     * await Persona.verifyEmail(token)
     * ```
     */
    verifyEmail(token: string): User;
    /**
     * Updates the user email address and fires an event for same. This
     * method will fire `email::changed` event.
     *
     * @method updateEmail
     *
     * @param  {Object}    user
     * @param  {String}    newEmail
     *
     * @return {User}
     *
     * @example
     * ```js
     * const user = auth.user
     * const newEmail = request.input('email')
     *
     * if (user.email !== newEmail) {
     *   await Persona.updateEmail(user, newEmail)
     * }
     * ```
     */
    updateEmail(user: Object, newEmail: string): User;
    /**
     * Update user profile. Updating passwords is not allowed here. Also
     * if email is provided, then this method will internally call
     * `updateEmail`.
     *
     * @method updateProfile
     *
     * @param  {Object}      user
     * @param  {Object}      payload
     *
     * @return {User}
     *
     * @example
     * ```js
     * const user = auth.user
     * const payload = request.only(['firstname', 'lastname', 'email'])
     *
     * await Persona.updateProfile(user, payload)
     * ```
     */
    updateProfile(user: Object, payload: Object): User;
    /**
     * Updates the user password. This method will emit `password::changed` event.
     *
     * @method updatePassword
     *
     * @param  {Object}       user
     * @param  {Object}       payload
     *
     * @return {User}
     *
     * @example
     * ```js
     * const user = auth.user
     * const payload = request.only(['old_password', 'password', 'password_confirmation'])
     *
     * await Persona.updatePassword(user, payload)
     * ```
     */
    updatePassword(user: Object, payload: Object): User;
    /**
     * Finds the user using one of their uids and then fires
     * `forgot::password` event with a temporary token
     * to update the password.
     *
     * @method forgotPassword
     *
     * @param  {String}       email
     *
     * @return {void}
     *
     * @example
     * ```js
     * const email = request.input('email')
     * await Persona.forgotPassword(email)
     * ```
     */
    forgotPassword(uid: any): void;
    /**
     * Updates the password for user using a pre generated token. This method
     * will fire `password::recovered` event.
     *
     * @method updatePasswordByToken
     *
     * @param  {String}              token
     * @param  {Object}              payload
     *
     * @return {User}
     *
     * @example
     * ```js
     * const token = request.input('token')
     * const payload = request.only(['password', 'password_confirmation'])
     *
     * await Persona.updatePasswordByToken(token, payload)
     * ```
     */
    updatePasswordByToken(token: string, payload: Object): User;
}
