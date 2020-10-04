'use strict'

const User = use('App/Models/User')
const Persona = use('Persona')

class UserController {
  async create ({ request, response }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await Persona.register(incomingUser)

    return response.json({ user })
  }

  async read ({ params }) {
    const user = await User.find(params.id)

    return user
  }

  async update ({ request, params }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await User.find(params.id)

    delete incomingUser.email

    return Persona.updateProfile(user, incomingUser)
  }

  async delete ({ params }) {
    const user = await User.find(params.id)

    await user.delete()
  }

  me ({ auth, params }) {
    /*if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }*/
    return auth.user
  }

  async getAll () {
    return User.all()
  }
}

module.exports = UserController
