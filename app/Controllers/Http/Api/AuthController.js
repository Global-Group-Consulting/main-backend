'use strict'

const User = use('App/Models/User')
const Event = use('Event')
const Env = use('Env')
const jwt = require('njwt')
const Persona = use('Persona')

class AuthController {
  _formatToken (token) {
    return token.replace(/ /g, '+')
  }

  async login ({ request, auth, response }) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const userAuth = await auth
        .withRefreshToken()
        .attempt(email, password)

      const user = await User.findBy({ 'email': email })

      if (userAuth) {
        return response.json({ 'user': user, 'access_token': userAuth })
      }
    } catch (e) {
      console.log(e)
      return response.json({ message: 'You first need to register!', error: e })
    }
  }

  async activate ({ request, response }) {
    const token = this._formatToken(request.input('token'))
    const password = request.input("password")

    const user = await Persona.verifyEmail(token)

    // Imposto la password iniziale
    user.password = password
    user.save()

    //TODO:: Maybe send a second email informing that the account is now ready to be used

    response.ok()
  }

  async forgot ({ request, response }) {
    const email = request.input('email')

    await Persona.forgotPassword(email)

    response.ok()
  }

  async resetPassword ({ request, response }) {
    const inputData = request.only(['token', 'password', 'password_confirmation'])

    await Persona.updatePasswordByToken(inputData.token, {
      password: inputData.password,
      password_confirmation: inputData.password_confirmation,
    })
  }
}

module.exports = AuthController
