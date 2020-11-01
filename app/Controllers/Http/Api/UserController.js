'use strict'

const User = use('App/Models/User')
const Persona = use('Persona')
const AccountStatuses = require("../../../../enums/AccountStatuses")

class UserController {
  async create({ request, response }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await Persona.register(incomingUser)

    return response.json(user)
  }

  async read({ params }) {
    const user = await User.find(params.id)

    return user.toJSON()
  }

  async update({ request, params }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await User.find(params.id)

    delete incomingUser.email

    return Persona.updateProfile(user, incomingUser)
  }

  async delete({ params }) {
    const user = await User.find(params.id)

    await user.delete()
  }

  me({ auth, params }) {
    /*if (Auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }*/
    return auth.user
  }

  async getAll() {
    const result = await User.query().aggregate([
      {
        $group: {
          _id: '$role',
          data: {
            $push: '$$ROOT'
          }
        }
      }
    ])

    return result.map(_group => {
      _group.id = _group._id
      delete _group._id

      _group.data = _group.data.map(_entry => {
        _entry.id = _entry._id.toString()

        delete _entry._id

        return _entry
      })

      return _group
    })
  }

  async getValidatedUsers() {
    return await User.where({ account_status: AccountStatuses.VALIDATED }).fetch()
  }
}

module.exports = UserController
