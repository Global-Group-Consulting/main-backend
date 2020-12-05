'use strict'

/**
 * @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse
 */

const User = use('App/Models/User')
const Token = use('App/Models/Token')
const File = use('App/Models/File')
/** @type {import("./History")} */
const HistoryModel = use('App/Models/History')

const Persona = use('Persona')
const Event = use('Event')
const AccountStatuses = require("../../../../enums/AccountStatuses")
const UserRoles = require("../../../../enums/UserRoles")
const UserNotFoundException = use("App/Exceptions/UserNotFoundException")

class UserController {
  async create({ request, response, auth }) {
    const incomingUser = request.only(User.updatableFields)

    if (+auth.user.role === UserRoles.AGENTE) {
      incomingUser.referenceAgent = auth.user._id.toString()
    }

    incomingUser.lastChangedBy = auth.user._id

    const user = await Persona.register(incomingUser)
    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user._id, auth.user._id)
      await User.includeFiles(user)
    }

    return response.json(user)
  }

  async read({ params }) {
    return await User.getUserData(params.id)
  }

  async update({ request, params, auth }) {
    const incomingUser = request.only(User.updatableFields)
    const user = await User.find(params.id)

    delete incomingUser.email

    incomingUser.lastChangedBy = auth.user._id

    const result = await Persona.updateProfile(user, incomingUser)
    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user._id, auth.user._id)
    }

    return User.getUserData(params.id)
  }

  async delete({ params }) {
    const user = await User.find(params.id)

    await user.delete()
  }

  async approve({ params, auth }) {
    const user = await User.find(params.id)

    if (!user) {
      throw new UserNotFoundException()
    }

    // If the status is DRAFT but the user is not a Admin or servCLienti, block it
    if (AccountStatuses.DRAFT == user.account_status && ![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+user.role)) {
      throw new Error("Invalid user role.")
    }

    user.account_status = AccountStatuses.APPROVED

    user.lastChangedBy = auth.user._id

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

  async changeStatus({ params, request, auth }) {
    const userId = params.id
    const newStatus = request.input("status")

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    user.lastChangedBy = auth.user._id
    user.account_status = newStatus

    await user.save()

    return user.toJSON()
  }

  async confirmDraft({params, auth, response}) {
    const userId = params.id
    const authUser = auth.user.toJSON()

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    if (user.referenceAgent !== authUser.id) {
      return response.badRequest("Permissions denied.")
    }

    user.account_status = AccountStatuses.CREATED
    await user.save()

    Event.emit("user::draftConfirmed", user)

    return user.toJSON()
  }

  me({auth, params}) {
    /*if (auth.user._id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }*/
    return auth.user
  }

  async getAll({request, auth}) {
    const userRole = +auth.user.role
    const filterRole = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) ? request.input("f") : null
    let match = {}
    let returnFlat = false
    let project = null

    // Filter used for fetching agents list
    if (filterRole && +filterRole === UserRoles.AGENTE) {
      match = {role: {$in: [filterRole.toString(), +filterRole]}}
      returnFlat = true
      project = {
        "firstName": 1,
        "lastName": 1,
        "role": 1,
        "id": 1
      }
    }

    if (userRole === UserRoles.AGENTE) {
      match = { "referenceAgent": { $in: [auth.user._id.toString(), auth.user._id] } }
    }

    return await User.groupByRole(match, returnFlat, project)
  }

  async getValidatedUsers() {
    return await User.where({ account_status: AccountStatuses.VALIDATED }).fetch()
  }
}

module.exports = UserController
