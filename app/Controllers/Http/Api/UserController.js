'use strict'

/**
 * @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse
 */

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
      throw new UserNotFoundException()
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

  /**
   * 
   * @param {{response: AdonisHttpResponse}} param0 
   */
  async sendEmailActivation({ params, response }) {
    const user = await User.find(params.id)

    if (!user) {
      throw new UserNotFoundException()
    }

    const token = await Token.where({ user_id: user.id, type: "email" }).first()

    if (!token) {
      return response.badRequest("Invalid user status.")
    }

    // Invia solo l'email di benvenuto con il codice per l'attivazione.
    Event.emit("user::approved", { user, token: token.token })
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

  async getAll({ request, auth }) {
    const userRole = +auth.user.role
    const filter = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) ? request.input("f") : null
    let match = {}
    let returnFlat = false

    if (filter) {
      match = { role: { $in: [filter.toString(), +filter] } }
      returnFlat = true
    }

    if (userRole === UserRoles.AGENTE) {
      match = { "referenceAgent": auth.user.id.toString() }
    }

    return await User.groupByRole(match, returnFlat)
  }

  async getValidatedUsers() {
    return await User.where({ account_status: AccountStatuses.VALIDATED }).fetch()
  }
}

module.exports = UserController
