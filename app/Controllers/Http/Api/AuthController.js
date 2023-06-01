'use strict'
'use strict'

const User = use('App/Models/User')
const Request = use('App/Models/Request')
const Event = use('Event')
const Persona = use('Persona')
const InvalidLoginException = use('App/Exceptions/InvalidLoginException')
const UserException = use('App/Exceptions/UserException')
const AccountStatuses = require('../../../../enums/AccountStatuses')
const UserRoles = require('../../../../enums/UserRoles')
const SecretKey = use("App/Models/SecretKey")

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
  async login({request, auth, response}) {
    const {email, password} = request.only(['email', 'password'])
    let authResult = null

    const lowerEmail = email.toLowerCase()

    try {
      /**
       * @type {AuthResult}
       */
      authResult = await auth
        .withRefreshToken()
        .attempt(lowerEmail, password)
    } catch (e) {
      throw new InvalidLoginException("Invalid credentials. Please check your email and password.")
    }
    
    const user = await User.where({email: lowerEmail}).first()
    const apps = user.apps || [];
    const requestedApp = await SecretKey.getClientApp(request.headers()["client-key"])
  
    if (!apps.includes(requestedApp)) {
      throw new InvalidLoginException("You don't have permission to access this app")
    }
  
    if (![AccountStatuses.APPROVED, AccountStatuses.ACTIVE].includes(user.account_status)
      || user.suspended) {
      throw new InvalidLoginException("Invalid user or suspended")
    }
  
    return response.json({
      'token': authResult.token,
      'refreshToken': authResult.refreshToken
    })
  
  }

  async user({auth}) {
    try {
      const userId = auth.user._id

      const userData = await (await User.find(userId)).full()

      /*
      i no more need it because this data are now saved in the users data.

      // if the user is an agent, i must add a prop that will indicate if it has an automatic withdrawl request active.
      if (userData.role === UserRoles.AGENTE) {
        const autoWithdrawlRequests = await Request.getActiveAutoWithdrawlRequests(userId);

        const withdrawlRequests = autoWithdrawlRequests.filter(req => req.autoWithdrawlAll && !req.autoWithdrawlAllRecursively)[0]
        const withdrawlRecursivelyRequests = autoWithdrawlRequests.filter(req => req.autoWithdrawlAll && req.autoWithdrawlAllRecursively)[0] || null;

        userData.autoWithdrawlAll = withdrawlRequests ? withdrawlRequests._id.toString() : null;
        userData.autoWithdrawlAllRecursively = withdrawlRecursivelyRequests ? withdrawlRecursivelyRequests._id.toString() : null;
      }*/

      return userData
    } catch (error) {
      console.error(error)
      throw new InvalidLoginException('Missing or invalid jwt token; ' + error.message);
    }
  }

  /**
   * Deletes the refreshing token so that the user can'0t refresh it's token.
   * CLient side it still needs to remove it from the api call header.
   *
   * @param auth
   * @return {Promise<void>}
   */
  async logout({auth}) {
    const user = await auth.getUser()
    const tokens = await auth.listTokensForUser(user)

    await auth.revokeTokens(tokens.map(token => token.token), true)
  }

  async refresh({request, auth}) {
    const refreshToken = request.input('refreshToken')

    if (auth.user && auth.user.suspended) {
      await this.logout({auth})

      throw new UserException("Account sospeso")
    }

    // Generate a new refresh token.
    // Pass "false" as the second parameter to avoid adding user data to jwt payload
    const newToken = await auth.generateForRefreshToken(refreshToken, false)

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
  async activate({request, response, auth}) {
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

    Event.emit("user::firstLogin", user)

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
  async forgot({request, response, auth}) {
    let email = request.input('email')
  
    email = email.toLowerCase()
  
    const user = await User.checkExists("email", email)
  
    if (user.account_status !== AccountStatuses.ACTIVE || user.suspended) {
      throw new UserException("Utente non trovato o account non attivo o sospeso")
    }
  
    // await Persona.forgotPassword(email)
    const token = await Persona.generateToken(user, 'password')
  
    Event.fire('forgot::password', {user, token, app: auth.requestedApp})
  
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
   * @param response
   * @return {Promise<void>}
   */
  async resetPassword({request, response, auth}) {
    const inputData = request.only(['token', 'password', 'password_confirmation'])
    const token = inputData.token.replace(/ /g, "+").replace(/%3D/g, "=")
  
    const user = await Persona.updatePasswordByToken(token, {
      password: inputData.password,
      password_confirmation: inputData.password_confirmation,
    })
  
    Event.fire('password::recovered', {user, app: auth.requestedApp})
  
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
