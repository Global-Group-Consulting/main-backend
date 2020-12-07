'use strict'

/**
 * @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse
 */


/** @type {typeof import("../../../Models/User")} */
const User = use('App/Models/User')
const Token = use('App/Models/Token')
const File = use('App/Models/File')
/** @type {typeof import("../../../Models/SignRequest")} */
const SignRequestModel = use('App/Models/SignRequest')
/** @type {typeof import("../../../../providers/DocSigner")} */
const DocSigner = use("DocSigner")
const Config = use("Config")

/** @type {typeof import("../../../Models/History")} */
const HistoryModel = use('App/Models/History')

const Persona = use('Persona')
const Event = use('Event')
const AccountStatuses = require("../../../../enums/AccountStatuses")
const UserRoles = require("../../../../enums/UserRoles")
const UserNotFoundException = use("App/Exceptions/UserNotFoundException")

class UserController {
  async create({request, response, auth}) {
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
    // return await User.getUserData(params.id)
    return (await User.find(params.id)).full()
  }

  async update({ request, params, auth }) {
    const incomingUser = request.only(User.updatableFields)
    const incompleteData = request.input("incompleteData")
    const user = await User.find(params.id)

    delete incomingUser.email

    incomingUser.lastChangedBy = auth.user._id

    if (user.account_status === AccountStatuses.INCOMPLETE && incompleteData.completed) {
      user.account_status = AccountStatuses.MUST_REVALIDATE

      Event.emit("user::mustRevalidate")
      // maybe could be useful to save who and when had set the user to "MUST REVALIDATE"
    }

    const result = await Persona.updateProfile(user, incomingUser)
    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user._id, auth.user._id)
    }

    return result.full()
  }

  async delete({ params }) {
    const user = await User.find(params.id)

    await user.delete()
  }

  /**
   *
   * @param {{response: AdonisHttpResponse}} param0
   */
  async sendActivationEmail({params, response}) {
    const user = await User.find(params.id)

    if (!user) {
      throw new UserNotFoundException()
    }

    const token = await Token.where({user_id: user.id, type: "email"}).first()

    if (!token) {
      return response.badRequest("Invalid user status.")
    }

    // add this data only to pass them to the triggered event
    user.token = token.token
    user.sendOnlyEmail = true

    // Will send the welcome email with the link to activate the account
    Event.emit("user::approved", user)
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

    return user.full()
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

    return user.full()
  }

  /**
   * Set a user state to INCOMPLETE by the SERV_CLIENTI.
   *
   * @param params
   * @param auth
   * @param request
   * @param response
   * @returns {Promise<*>}
   */
  async incomplete({params, auth, request, response}) {
    const userId = params.id
    const authUser = auth.user.toJSON()
    const incompleteData = request.only(["message", "checkedFields"])

    if (authUser.role !== UserRoles.SERV_CLIENTI) {
      return response.unauthorized("Permission denied.")
    }

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    user.account_status = AccountStatuses.INCOMPLETE
    user.incompleteData = incompleteData

    delete user.incompleteData.completed

    await user.save()

    Event.emit("user::incomplete", user)

    return user.full()
  }

  /**
   * Validate a users Data and trigger the contract signing
   *
   * @param params
   * @param auth
   * @param request
   * @param response
   * @returns {Promise<*>}
   */
  async validate({params, auth, request, response}) {
    const userId = params.id
    const authUser = auth.user.toJSON()

    if (authUser.role !== UserRoles.SERV_CLIENTI) {
      return response.unauthorized("Permission denied.")
    }

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    /** @type {import("../../../../@types/SignRequest/Config.d").Config} */
    const docsConfig = Config.get("docSigner")
    const signRequest = await DocSigner.sendSignRequest(docsConfig.templates.mainContract, user.toJSON())

    // Once the signRequest has been sent, stores it in the signRequest collection adding that userId that it refers to.
    signRequest.userId = user.id
    await SignRequestModel.create(signRequest)

    // Update the user status account to VALIDATED
    user.account_status = AccountStatuses.VALIDATED

    // Save the user and wait for the signRequest webhooks
    await user.save()

    Event.emit("user::validated", user)

    return user.full()
  }

  async approve({params, auth}) {
    const user = await User.find(params.id)

    if (!user) {
      throw new UserNotFoundException()
    }

    // If the status is DRAFT but the user is not a Admin or servCLienti, block it
    if (AccountStatuses.DRAFT === user.account_status &&
      ![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+user.role)) {
      throw new Error("Invalid user role.")
    }

    user.account_status = AccountStatuses.APPROVED
    user.lastChangedBy = auth.user._id

    await user.save()

    return user.full()
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
