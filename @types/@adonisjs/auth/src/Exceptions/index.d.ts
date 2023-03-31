/**
 * This exception is raised when user is not found. This usally
 * happens when trying to authenticate user using their
 * credentials.
 *
 * @class UserNotFoundException
 */
export class UserNotFoundException {
    static invoke(message: any, uidField: any, passwordField: any, authScheme: any): UserNotFoundException;
    /**
     * Handle user not found exception, this method does all
     * lot of work to find the correct way to handle the
     * exception. Try reading the code to understand
     * it.
     *
     * @method handle
     *
     * @param  {Object} error
     * - `{ status: 500, uidField: 'id', passwordField: 'password', authScheme: 'session' }`
     * @param {Object} ctx
     *
     * @return {void}
     */
    handle({ status, uidField, passwordField, authScheme }: Object, { request, response, session }: Object): void;
}
/**
 * This exception is raised when user password mis-matches. This usally
 * happens when trying to authenticate user using their credentials.
 *
 * @class PasswordMisMatchException
 */
export class PasswordMisMatchException {
    static invoke(message: any, passwordField: any, authScheme: any): PasswordMisMatchException;
    /**
     * Handle password mis-match exception, this method does a
     * lot of work to find the correct way to handle the
     * exception. Try reading the code to understand
     * it.
     *
     * @method handle
     *
     * @param  {Object} error
     * - `{ status: 500, passwordField: 'password', authScheme: 'session' }`
     * @param {Object} ctx
     *
     * @return {void}
     */
    handle({ status, passwordField, authScheme }: Object, { request, response, session }: Object): void;
}
/**
 * This exception is raised when jwt token is invalid or
 * unable to find user for JWT token.
 *
 * @class InvalidJwtToken
 */
export class InvalidJwtToken {
    static invoke(message: any): InvalidJwtToken;
}
/**
 * This exception is raised when jwt refresh token is
 * invalid.
 *
 * @class InvalidRefreshToken
 */
export class InvalidRefreshToken {
    static invoke(refreshToken: any): InvalidRefreshToken;
}
/**
 * This exception is raised when jwt token is expired
 *
 * @class ExpiredJwtToken
 */
export class ExpiredJwtToken {
    static invoke(): ExpiredJwtToken;
}
/**
 * This exception is raised when basic auth credentials are
 * missing.
 *
 * @class InvalidBasicAuthException
 */
export class InvalidBasicAuthException {
    /**
     * The basic auth header/credentials are missing
     *
     * @method invoke
     *
     * @return {Object}
     */
    static invoke(): Object;
    /**
     * Handle the exception itself
     *
     * @method handle
     *
     * @param  {Object} error
     * - `{ status: 500, passwordField: 'password', authScheme: 'session' }`
     * @param {Object} ctx
     *
     * @return {void}
     */
    handle({ status }: Object, { request, response }: Object): void;
}
/**
 * This exception is raised when API token is invalid
 *
 * @class InvalidApiToken
 */
export class InvalidApiToken {
    static invoke(): InvalidApiToken;
}
/**
 * This exception is raised when user session is invalid
 *
 * @class InvalidSessionException
 */
export class InvalidSessionException {
    static invoke(): InvalidSessionException;
}
