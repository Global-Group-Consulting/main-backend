'use strict'

const User = use('App/Models/User');
const Event = use('Event')
const Env = use("Env")
const jwt = require('njwt')

class AuthController {
  async login({ request, auth, response }) {
    const email = request.input("email")
    const password = request.input("password");

    try {
      const userAuth = await auth
        .withRefreshToken()
        .attempt(email, password)

      const user = await User.findBy({ "email": email })

      if (userAuth) {
        return response.json({ "user": user, "access_token": userAuth })
      }
    }

    catch (e) {
      console.log(e);
      return response.json({ message: 'You first need to register!', error: e })
    }
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
      type: "password_reset"
    }, Env.getOrFail("TOKENS_KEY")).compact()

    await user.save()

    Event.fire("user::reset-password", user)
  }
}

module.exports = AuthController
