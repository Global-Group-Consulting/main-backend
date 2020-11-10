'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token')
const File = use('App/Models/File')
const Persona = use('Persona')
const Event = use('Event')
const AccountStatuses = require("../../../../enums/AccountStatuses")
const UserRoles = require("../../../../enums/UserRoles")
const UserNotFoundException = use("App/Exceptions/UserNotFoundException")

class UserController {
  async create({ request, response, auth }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await Persona.register(incomingUser)

    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user.id, auth.user.id)
      await User.includeFiles(user)
    }

    return response.json(user)
  }

  async read({ params }) {
    const user = await User.find(params.id)

    return user.toJSON()
  }

  async update({ request, params, auth }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await User.find(params.id)

    delete incomingUser.email

    const result = await Persona.updateProfile(user, incomingUser)

    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user.id, auth.user.id)
      await User.includeFiles(result)
    }

    return result
  }

  async delete({ params }) {
    const user = await User.find(params.id)

    await user.delete()
  }

  async approve({ params }) {
    const user = await User.find(params.id)

    if (!user) {
      throw new Error("No user found")
    }

    // If the status is DRAFT but the user is not a Admin or servCLienti, block it
    if (AccountStatuses.DRAFT == user.account_status && ![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+user.role)) {
      throw new Error("Invalid user role.")
    }

    user.account_status = AccountStatuses.APPROVED

    await user.save()

    // generate a new token
    const token = await Persona.generateToken(user, 'email')

    //check if token exist otherwise create it

    Event.emit("user::approved", { user, token })

    return user
  }

  async changeStatus({ params, request }) {
    const userId = params.id
    const newStatus = request.input("status")

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    user.account_status = newStatus

    await user.save()

    return user.toJSON()
  }

  me({ auth, params }) {
    /*if (Auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }*/
    return auth.user
  }

  async getAll({ request }) {
    const filter = request.input("f")

    if (filter) {
      const result = await User.where({ role: { $in: [filter.toString(), +filter] } })
        .sort({ firstName: 1, lastName: 1 })
        .fetch()

      return result ? result.rows : []
    }

    const result = await User.query().aggregate([
      {
        $group: {
          _id: { $toInt: '$role' },
          data: {
            $push: '$$ROOT'
          }
        }
      }
    ])


    return result.map(_group => {
      _group.id = +_group._id

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
