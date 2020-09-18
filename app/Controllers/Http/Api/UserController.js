'use strict'

const User    = use('App/Models/User')
const Persona = use('Persona')

class UserController {
  async add({ request, response }) {
    const payload = request.only([ 'username', 'email' ])
    const user    = await Persona.register({
      ...payload,
      password:              'tempPassword',
      password_confirmation: 'tempPassword'
    })

    return response.json({ user })
  }

  async show({ params }) {
    const user = await User.find(params.id)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  me({ auth, params }) {
    /*if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }*/
    return auth.user
  }

  async getAll() {
    return User.all()
  }
}

module.exports = UserController
