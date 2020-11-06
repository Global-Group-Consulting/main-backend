'use strict'

const User = use('App/Models/User')
const Event = use('Event')
const Persona = use('Persona')

/**
 * @typedef AuthResult
 * @property {string} type
 * @property {string} token
 * @property {string} refreshToken
 */

class AuthController {
  _formatToken(token) {
    return token.replace(/ /g, '+')
  }

  /**
   * Login a user returning a token and a refreshToken that is stored
   * in the db so that the user can refresh its token.
   *
   * @param request
   * @param auth
   * @param response
   * @return {Promise<void|*>}
   */
  async login({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password'])

    try {
      /**
       * @type {AuthResult}
       */
      const authResult = await auth
        .withRefreshToken()
        .attempt(email, password)

      // const user = await User.findBy({ 'email': email })
      // 'user': user.toJSON(),

      return response.json({
        'token': authResult.token,
        'refreshToken': authResult.refreshToken
      })
    } catch (e) {
      console.log(e)
      return response.badRequest({ message: 'Invalid username or password!', error: e })
    }
  }

  async user({ request, auth, response }) {
    try {
      return await auth.getUser()
    } catch (error) {
      response.send('Missing or invalid jwt token')
    }
  }

  /**
   * Deletes the refreshing token so that the user can'0t refresh it's token.
   * CLient side it still needs to remove it from the api call header.
   *
   * @param auth
   * @return {Promise<void>}
   */
  async logout({ auth }) {
    const user = await auth.getUser()
    const tokens = await auth.listTokensForUser(user)

    await auth.revokeTokens(tokens.map(token => token.token), true)
  }

  async refresh({ request, auth }) {
    const refreshToken = request.input('refresh_token')

    const newToken = await auth.generateForRefreshToken(refreshToken.split(' ')[1], true)

    return newToken
  }

  /**
   * After the user is created, it receives an email with a token that
   * must to be used to verify its email. That form requires to set a password for the account.
   *
   * This method receives the password and the token
   * and changes the user data.
   *
   * @param request
   * @param response
   * @return {Promise<void>}
   */
  async activate({ request, response, auth }) {
    const token = this._formatToken(request.input('token'))
    const password = request.input('password')

    const user = await Persona.verifyEmail(token)

    // Imposto la password iniziale
    user.password = password
    await user.save()

    //TODO:: Maybe send a second email informing that the account is now ready to be used

    const authResult = await auth
      .withRefreshToken()
      .attempt(user.email, password)

    return response.json({
      'token': authResult.token,
      'refreshToken': authResult.refreshToken
    })
  }

  /**
   * When the user goes to the "Forgot password" page,
   * this method creates a token and trigger the sending of
   * the email with the instructions to recover it.
   *
   * @param request
   * @param response
   * @return {Promise<void>}
   */
  async forgot({ request, response }) {
    const email = request.input('email')

    await Persona.forgotPassword(email)

    response.ok()
  }

  /**
   * After the user has received the email with the token for recovering the password,
   * sets the new password.
   *
   * This method stores the new password for the user.
   *
   * @param request
   * @param response
   * @return {Promise<void>}
   */
  async resetPassword({ request, response, auth }) {
    const inputData = request.only(['token', 'password', 'password_confirmation'])
    const token = inputData.token.replace(/ /g, "+").replace(/%3D/g, "=")

    const user = await Persona.updatePasswordByToken(token, {
      password: inputData.password,
      password_confirmation: inputData.password_confirmation,
    })

    const authResult = await auth
      .withRefreshToken()
      .attempt(user.email, inputData.password)

    return response.json({
      'token': authResult.token,
      'refreshToken': authResult.refreshToken
    })

  }
}

module.exports = AuthController
