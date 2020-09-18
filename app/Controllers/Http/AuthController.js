'use strict'

const User    = use('App/Models/User')
const Event   = use('Event')
const Env     = use('Env')
const Persona = use('Persona')
const jwt     = require('njwt')


class AuthController {
  async login({ request, auth, response }) {
    const payload = request.only([ 'uid', 'password' ])

    const user = await Persona.verify(payload)

    await auth.login(user)
  }

  async logout({ auth }) {
    const user = auth.current.user
    const token = auth.getAuthHeader()

    await user
      .tokens()
      .where('token', token)
      .update({ is_revoked: true })
  }

  async reset({ request, auth }) {
    const email = request.input("email")
    const user = await User.findBy({ 'email': email })

    if (!user) {
      throw new Error("No user found")
    }

    user.passwordResetToken = jwt.create({
      email,
      type: 'password_reset'
    }, Env.getOrFail('TOKENS_KEY')).compact()

    await user.save()

    Event.fire('user::reset-password', user)
  }

  async verifyEmail({ request }) {
    const token = request.input('token').replace(' ', '+')

    console.log(token)

    const user = await Persona.verifyEmail(token)

    return user
  }

  async forgotPassword({ request }) {
    const email = request.input('email')

    await Persona.forgotPassword({ email })
  }

}

module.exports = AuthController
