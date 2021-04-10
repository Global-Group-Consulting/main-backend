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

const AclProvider = use("AclProvider")

/** @type {typeof import("../../../Models/History")} */
const HistoryModel = use('App/Models/History')

const Persona = use('Persona')
const Event = use('Event')
const UserNotFoundException = use("App/Exceptions/UserNotFoundException")

const AccountStatuses = require("../../../../enums/AccountStatuses")
const UserRoles = require("../../../../enums/UserRoles")
const PersonTypes = require("../../../../enums/PersonTypes")
const {UsersPermissions} = require("../../../Helpers/Acl/enums/users.permissions")

/** @type {import("../../../Exceptions/UserException")} */
const UserException = use("App/Exceptions/UserException")
/** @type {import("../../../Exceptions/Acl/AclGenericException")} */
const AclGenericException = use("App/Exceptions/Acl/AclGenericException")

const moment = require("moment")

const {
  formatWrittenNumbers, formatDate, formatContractNumber, formatMoney,
  formatCountry, formatRegion, formatProvince, formatCity,
  formatPaymentMethod
} = require("../../../Helpers/ModelFormatters")

const rolesMap = {
  "admin": "admin",
  "servClienti": "clients_service",
  "agente": "agent",
  "cliente": "client",
}

class UserController {
  /**
   *
   * @param userId
   * @returns {Promise<typeof import("../../../Models/User")>}
   * @private
   */
  async _checkIncomingUser(userId) {
    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    return user
  }

  /**
   *
   * @param user
   * @param {string} existingRequestId
   * @returns {Promise<SignRequestModel>}
   * @private
   */
  async _prepareAndSendSignRequest(user, existingRequestId) {
    const fieldsToEmpty = []
    /** @type {import("../../../../@types/SignRequest/Config.d").Config} */
    const docsConfig = Config.get("docSigner")
    /** @type {import("../../../../@types/User.d").User} */
    const userData = user.toJSON()
    const contractData = {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      fullName: userData.firstName + " " + userData.lastName,
      birthCity: await formatCity(userData.birthCity),
      birthProvince: await formatProvince(userData.birthProvince),
      birthDate: formatDate(userData.birthDate),
      residenceAddress: userData.legalRepresentativeAddress,
      residenceZip: userData.legalRepresentativeZip,
      residenceCity: await formatCity(userData.legalRepresentativeCity),
      residenceProvince: await formatProvince(userData.legalRepresentativeProvince),
      fiscalCode: userData.fiscalCode,
      mobile: userData.mobile,
      email: userData.email,
      contractNumber: formatContractNumber(userData.contractNumber),
      contractDate: formatDate(moment()),
      contractPercentage: userData.contractPercentage,

      // dati persona giuridica
      businessName: userData.businessName,
      businessRegion: await formatCountry(userData.businessCountry, true),
      businessCity: await formatCity(userData.businessCity),
      businessProvince: await formatProvince(userData.businessProvince),
      businessAddress: userData.businessAddress,
      vatNumber: userData.vatNumber,
      legalRepresentativeFullName: userData.firstName + " " + userData.lastName,
      legalRepresentativeBirthCity: await formatCity(userData.birthCity),
      legalRepresentativeBirthProvince: await formatProvince(userData.birthProvince),
      legalRepresentativeBirthDate: formatDate(userData.birthDate),
      legalRepresentativeCF: userData.fiscalCode,

      // Dati versamento iniziale
      contractInitialInvestmentGold: userData.contractInitialInvestmentGold,
      contractInitialInvestmentGoldText: formatWrittenNumbers(userData.contractInitialInvestmentGold),
      contractInitialInvestmentGoldVal: formatMoney(userData.contractInitialInvestment, true),
      contractInitialInvestmentGoldValText: formatWrittenNumbers(userData.contractInitialInvestment),
      contractPaymentMethod: formatPaymentMethod(userData.contractInitialPaymentMethod, userData.contractInitialPaymentMethodOther),
      contractInitialInvestment: formatMoney(userData.contractInitialInvestment, true),
      contractInitialInvestmentText: formatWrittenNumbers(userData.contractInitialInvestment)
    }

    if (user.personType === PersonTypes.FISICA) {
      fieldsToEmpty.push(
        "businessName",
        "businessRegion",
        "businessCity",
        "businessProvince",
        "businessAddress",
        "vatNumber",
        "legalRepresentativeFullName",
        "legalRepresentativeBirthCity",
        "legalRepresentativeBirthProvince",
        "legalRepresentativeBirthDate",
        "legalRepresentativeCF",
      )
    } else {
      fieldsToEmpty.push(
        "fullName",
        "birthCity",
        "birthProvince",
        "birthDate",
        "residenceAddress",
        "residenceZip",
        "residenceCity",
        "residenceProvince",
        "fiscalCode",
      )
    }

    if (!user.contractInitialInvestmentGold) {
      fieldsToEmpty.push(
        "contractInitialInvestmentGold",
        "contractInitialInvestmentGoldText",
        "contractInitialInvestmentGoldVal",
        "contractInitialInvestmentGoldValText",
      )
    } else {
      fieldsToEmpty.push(
        "contractPaymentMethod",
        "contractInitialInvestment",
        "contractInitialInvestmentText"
      )
    }

    for (const field of fieldsToEmpty) {
      contractData[field] = "-"
    }

    const signRequest = await DocSigner.sendSignRequest(docsConfig.templates.mainContract, contractData, existingRequestId)

    // Once the signRequest has been sent, stores it in the signRequest collection adding that userId that it refers to.
    signRequest.userId = user._id

    await SignRequestModel.create(signRequest)

    return signRequest
  }

  async create({request, response, auth}) {
    const incomingUser = request.only(User.updatableFields)


    if (+auth.user.role === UserRoles.AGENTE) {
      incomingUser.referenceAgent = auth.user._id.toString()
    }

    incomingUser.lastChangedBy = auth.user._id.toString()

    const user = await Persona.register(incomingUser)
    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user._id, auth.user._id)
      await User.includeFiles(user)
    }

    return user.toJSON()
  }

  async read({params}) {
    // return await User.getUserData(params.id)
    return (await User.find(params.id)).full(true)
  }

  async update({request, params, auth, response}) {
    const incomingUser = request.only(User.updatableFields)
    const incompleteData = request.input("incompleteData")
    /**
     * @type {User}
     */
    const user = await User.find(params.id)

    // If still in draft, allow to change the email
    if (user.account_status !== AccountStatuses.DRAFT) {
      delete incomingUser.email
    } else {
      const emailExists = await User.where({"email": incomingUser.email, "_id": {$not: {$eq: user._id}}}).first()

      if (emailExists) {
        throw new UserException("Email already exists")
      }
    }

    incomingUser.lastChangedBy = auth.user._id

    /*
      If the role changes, i also must update the permissions "roles" field.
     */
    if (incomingUser.role && incomingUser.role !== user.role) {
      incomingUser.roles = [rolesMap[UserRoles.get(incomingUser.role).id]]
    }

    if (user.account_status === AccountStatuses.INCOMPLETE && incompleteData.completed) {
      user.account_status = AccountStatuses.MUST_REVALIDATE

      Event.emit("user::mustRevalidate", user)
      // maybe could be useful to save who and when had set the user to "MUST REVALIDATE"
    }

    /*
    If changing the reference agent, must check if the new agent
    Is a subAgent of the changed agent
     */
    if (+incomingUser.role === UserRoles.AGENTE
      && incomingUser.referenceAgent && user.referenceAgent !== incomingUser.referenceAgent) {
      // Get all SubAgents
      const teamAgents = await User.getTeamAgents(user)

      // Search if the new reference agent is a subAgent.
      const subAgent = teamAgents.find(_sub => _sub._id.toString() === incomingUser.referenceAgent)
      if (subAgent) {
        // If so, set that agent reference agent,
        // the one was for the user that has been updated
        subAgent.referenceAgent = user.referenceAgent

        await subAgent.save()
      }
    }

    const result = await Persona.updateProfile(user, incomingUser)
    const files = request.files()

    if (Object.keys(files).length > 0) {
      await File.store(files, user._id, auth.user._id)
    }

    Event.emit("user::updated", result)

    return result.full()
  }

  async delete({params}) {
    const user = await User.find(params.id)

    // await user.delete()
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

    let token = await Token.where({user_id: user.id, type: "email"}).first()

    if (!token && user.account_status === AccountStatuses.APPROVED) {
      token = await Persona.generateToken(user, 'email')
    } else if (!token) {
      throw new UserException("Invalid user status.")
    }

    // add this data only to pass them to the triggered event
    user.token = token.token
    user.sendOnlyEmail = true

    // Will send the welcome email with the link to activate the account
    Event.emit("user::approved", user)
  }

  async changeStatus({params, request, auth}) {
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

  async approve({params, auth, response}) {
    const user = await this._checkIncomingUser(params.id)

    if ([UserRoles.CLIENTE, UserRoles.AGENTE].includes(+user.role)) {
      // if (!auth.user.superAdmin) {
      throw new UserException("You can't perform this action.", UserException.statusCodes.FORBIDDEN)
      // }

      /*const userContract = await user.contractFiles().fetch()

      if (userContract.rows.length === 0) {
        throw new UserException("User must first have a contract.")
      }*/
    }

    // Force the user to approved state.
    // For ADMIN and SERV_CLIENTI, this is normal.
    // For other roles, this is used to force the status by superadmin
    user.account_status = AccountStatuses.APPROVED
    user.lastChangedBy = auth.user._id
    user.calcAgentCommissions = false

    await user.save()

    Event.emit("user::approved", user)

    return user.full()
  }

  async confirmDraft({params, auth, response}) {
    const userId = params.id
    const authUser = auth.user.toJSON()
    const authUserAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(authUser.role)

    const user = await this._checkIncomingUser(userId)

    // If user is cliente, then check the reference agent. Only he can change the status.
    if ([UserRoles.AGENTE, UserRoles.CLIENTE].includes(user.role)) {
      if (!user.contractImported) {
        if (user.referenceAgent && user.referenceAgent.toString() !== authUser.id && !authUserAdmin) {
          return response.badRequest("Permissions denied.")
        }

        const signRequest = await this._prepareAndSendSignRequest(user)

        user.contractSignRequestUuid = signRequest.uuid
        // I set the state to validate so i won't need the validation by serv_clienti
        // as requested in issue #32
        user.account_status = AccountStatuses.VALIDATED
      } else {
        // If the contract was imported, i skip the sign request and immediatly activate the user

        user.account_status = AccountStatuses.APPROVED
      }
    } else {
      return response.badRequest("User is not CLIENTE.")
    }

    await user.save()

    // I trigger validated as requested by issue #32
    Event.emit("user::" + user.account_status, user)

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

    const signRequest = await this._prepareAndSendSignRequest(user)

    // Update the user status account to VALIDATED
    user.account_status = AccountStatuses.VALIDATED
    user.contractSignRequestUuid = signRequest.uuid

    // Save the user and wait for the signRequest webhooks
    await user.save()

    Event.emit("user::validated", user)

    return user.full()
  }

  async importContract({request}) {
    const userId = request.input("userId")
    const fileToImport = request.file("fileToImport")

    /** @type {User} */
    const user = await User.find(userId)

    if (!user) {
      throw new Error("Can't find any user")
    }

    if (user.account_status === AccountStatuses.APPROVED && user.contractSignedAt) {
      return
    }

    if (!fileToImport) {
      throw new UserException("No file provided for import.")
    }

    user.incompleteData = null // reset existing incomplete data
    user.contractSignedAt = new Date()
    user.contractImported = true

    try {
      // Store the contract file in S3
      await File.store([fileToImport], user._id, user._id, {
        clientName: fileToImport.clientName,
        extname: "pdf",
        fileName: "null",
        fieldName: "contractDoc",
        type: "application",
        subtype: "pdf",
      })
    } catch (er) {
      throw er
    }

    await user.save()

    return user.full()
  }

  me({auth, params}) {
    return auth.user
  }

  async getAll({request, auth}) {
    const userRole = +auth.user.role
    const filterRole = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI, UserRoles.AGENTE].includes(userRole) ? request.input("f") : null
    let match = {}
    let returnFlat = false
    let project = null
    let result

    // Filter used for fetching agents list
    if (filterRole && +filterRole === UserRoles.AGENTE) {
      match["role"] = {$in: [filterRole.toString(), +filterRole]}
      returnFlat = true
      project = {
        "firstName": 1,
        "lastName": 1,
        "role": 1,
        "id": 1
      }
    }

    if (userRole === UserRoles.AGENTE) {
      match["referenceAgent"] = {$in: [auth.user._id.toString(), auth.user._id]}
    }
    /*
    If the user is an agent and has subAgents and the filter for agents is active,
    return the list of all agents for the agents team
     */
    if (userRole === UserRoles.AGENTE) {
      const hasSubAgents = (await auth.user.subAgents().fetch()).rows.length > 0

      if (hasSubAgents) {
        const returnFilterByRole = filterRole && +filterRole === UserRoles.AGENTE
        const teamAgents = await User.getTeamAgents(auth.user, !returnFilterByRole)

        if (returnFilterByRole) {
          return teamAgents
        }

        const toReturn = await User.groupByRole(match, returnFlat, project)
        const agentsGroupIndex = toReturn.findIndex(_data => _data.id === UserRoles.AGENTE.toString())

        if (agentsGroupIndex >= 0) {
          toReturn[agentsGroupIndex].data = teamAgents
        }

        return toReturn
      }
    }

    return await User.groupByRole(match, returnFlat, project)
  }

  async getValidatedUsers() {
    return await User.where({account_status: AccountStatuses.VALIDATED}).fetch()
  }

  async getClientsList({params, auth}) {
    const user = auth.user
    const userRole = +auth.user.role
    const userId = params.id

    if (!(await AclProvider.checkPermissions([UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ], auth))) {
      throw new AclGenericException("Not enough permissions", AclGenericException.statusCodes.FORBIDDEN)
    }

    // The user is an agent, otherwise this call is useless
    const subAgentsList = await User.getTeamAgents(userId, true )
    const authUserIsParent = subAgentsList.find(el => el._id.toString() === userId)

    if (!authUserIsParent) {
      throw new AclGenericException("Not enough permissions", AclGenericException.statusCodes.FORBIDDEN)
    }

    const subAgentsIdList = subAgentsList.map(el => el._id.toString())

    return await User.getClientsList(userId, subAgentsIdList)
  }

  async getSignRequestLogs({params, auth}) {
    const userId = params.id
    const authUserAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(auth.user.role)

    if (!authUserAdmin && userId !== auth.user._id.toString()) {
      throw new UserException("Action not allowed", 401)
    }

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    return user.fetchSigningLogs()
  }

  async resendContract({params, auth}) {
    const userId = params.id
    const authUser = auth.user.toJSON()

    if (authUser.role === UserRoles.CLIENTE) {
      return response.unauthorized("Permission denied.")
    }

    const user = await User.find(userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    // First get the existing request and get its state.
    const existingRequestId = await SignRequestModel.getRequestUuid(user._id)

    const signRequest = await this._prepareAndSendSignRequest(user, existingRequestId)

    user.contractStatus = null
    user.contractSignRequestUuid = signRequest.uuid

    // Save the user and wait for the signRequest webhooks
    await user.save()
  }
}

module.exports = UserController
