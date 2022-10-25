'use strict'

/**
 * @typedef {import('../../../../@types/HttpResponse').AdonisHttpResponse} AdonisHttpResponse
 * @typedef {import('../../../../@types/HttpRequest').HttpRequest} HttpRequest
 * @typedef {import('../../../../@types/Auth').Auth} Auth
 */

/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User')
const Token = use('App/Models/Token')
const File = use('App/Models/File')
/** @type {typeof import('../../../Models/SignRequest')} */
const SignRequestModel = use('App/Models/SignRequest')
/** @type {import('../../../../providers/DocSigner')} */
const DocSigner = use('DocSigner')
const Config = use('Config')

/** @type {import('../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')

/** @type {typeof import('../../../Models/History')} */
const HistoryModel = use('App/Models/History')

const Persona = use('Persona')
const Event = use('Event')
const UserNotFoundException = use('App/Exceptions/UserNotFoundException')

const AccountStatuses = require('../../../../enums/AccountStatuses')
const UserRoles = require('../../../../enums/UserRoles')
const AclUserRoles = require('../../../../enums/AclUserRoles')
const PersonTypes = require('../../../../enums/PersonTypes')
const { UsersPermissions } = require('../../../Helpers/Acl/enums/users.permissions')
const { validate } = use('Validator')

/** @type {import('../../../Exceptions/UserException')} */
const UserException = use('App/Exceptions/UserException')

/** @type {typeof import('../../../Exceptions/Acl/AclGenericException')} */
const AclGenericException = use('App/Exceptions/Acl/AclGenericException')

const moment = require('moment')
const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const UserFiltersMap = require('../../../Filters/UserFilters.map')

const {
  formatWrittenNumbers, formatDate, formatContractNumber, formatMoney,
  formatCountry, formatRegion, formatProvince, formatCity,
  formatPaymentMethod
} = require('../../../Helpers/ModelFormatters')

const rolesMap = {
  'admin': 'admin',
  'servClienti': 'clients_service',
  'agente': 'agent',
  'cliente': 'client'
}

class UserController {
  /**
   *
   * @param userId
   * @returns {Promise<typeof import('../../../Models/User')>}
   * @private
   */
  async _checkIncomingUser (userId) {
    const user = await User.find(userId)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    return user
  }
  
  /**
   * @param user
   * @param {string} existingRequestId
   * @returns {Promise<SignRequestModel>}
   * @private
   */
  async _prepareAndSendSignRequest (user, existingRequestId) {
    const fieldsToEmpty = []
    /** @type {import('../../../../@types/SignRequest/Config.d').Config} */
    const docsConfig = Config.get('docSigner')
    /** @type {import('../../../../@types/User.d').User} */
    const userData = user.toJSON()
    const contractData = {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      fullName: userData.firstName + ' ' + userData.lastName,
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
      legalRepresentativeFullName: userData.firstName + ' ' + userData.lastName,
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
        'businessName',
        'businessRegion',
        'businessCity',
        'businessProvince',
        'businessAddress',
        'vatNumber',
        'legalRepresentativeFullName',
        'legalRepresentativeBirthCity',
        'legalRepresentativeBirthProvince',
        'legalRepresentativeBirthDate',
        'legalRepresentativeCF'
      )
    } else {
      fieldsToEmpty.push(
        'fullName',
        'birthCity',
        'birthProvince',
        'birthDate',
        'residenceAddress',
        'residenceZip',
        'residenceCity',
        'residenceProvince',
        'fiscalCode'
      )
    }
    
    if (!user.contractInitialInvestmentGold) {
      fieldsToEmpty.push(
        'contractInitialInvestmentGold',
        'contractInitialInvestmentGoldText',
        'contractInitialInvestmentGoldVal',
        'contractInitialInvestmentGoldValText'
      )
    } else {
      fieldsToEmpty.push(
        'contractPaymentMethod',
        'contractInitialInvestment',
        'contractInitialInvestmentText'
      )
    }
    
    for (const field of fieldsToEmpty) {
      contractData[field] = '-'
    }
    
    const signRequest = await DocSigner.sendSignRequest(docsConfig.templates.mainContract, contractData, existingRequestId)
    
    // Once the signRequest has been sent, stores it in the signRequest collection adding that userId that it refers to.
    signRequest.userId = user._id
    
    await SignRequestModel.create(signRequest)
    
    return signRequest
  }
  
  _authUserAdmin (auth) {
    return [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(auth.user.role)
  }
  
  async create ({ request, response, auth }) {
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
  
  async read ({ params, auth }) {
    if (!auth.user.isAdmin() && params.id !== auth.user._id.toString()) {
      // can read its own data
      const teamUsers = await User.getTeamUsersIds(auth.user._id)
      
      // check if the requested user is in the team, otherwise throw an error
      if (!teamUsers.includes(params.id)) {
        throw new AclGenericException('You can\'t read this user data')
      }
    }
    
    // return await User.getUserData(params.id)
    return (await User.find(params.id)).full(true)
  }
  
  async update ({ request, params, auth, response }) {
    const incomingUser = request.only(User.updatableFields)
    const roleChangeData = request.input('roleChangeData')
    const incompleteData = request.input('incompleteData')
    
    // non so perchè avevo vietato di cambiare il ruolo. Ora lo rimetto
    // delete incomingUser.role
    delete incomingUser.roles
    
    /**
     * @type {typeof User}
     */
    const user = await User.find(params.id)
    const userRoleChanged = incomingUser.role && incomingUser.role !== user.role
    const userWasAgent = userRoleChanged && user.role === UserRoles.AGENTE
    
    // If still in draft OR the auth user is a superAdmin, allow to change the email
    // otherwise, avoid it.
    if (user.account_status !== AccountStatuses.DRAFT && !auth.user.superAdmin) {
      delete incomingUser.email
    } else {
      const emailExists = await User.where({ 'email': incomingUser.email, '_id': { $not: { $eq: user._id } } }).first()
      
      if (emailExists) {
        throw new UserException('Email already exists')
      }
      
      // Set the new email directly on the user so that when Persona handles the saving, avoid changing the user status
      user.email = incomingUser.email
    }
    
    incomingUser.lastChangedBy = auth.user._id
    
    /*
      If the role changes, I also must update the permissions "roles" field.
     */
    if (incomingUser.role && +incomingUser.role !== +user.role) {
      const oldRoleName = rolesMap[UserRoles.get(user.role).id]
      const newRoleName = rolesMap[UserRoles.get(incomingUser.role).id]
  
      incomingUser.roles = user.roles
      
      // must remove the old role from the roles array
      const existingIndex = user.roles.findIndex(role => role === oldRoleName)
      incomingUser.roles.splice(existingIndex, 1)
      
      // then add the new one
      incomingUser.roles.push(newRoleName)
    }
    
    if (user.account_status === AccountStatuses.INCOMPLETE && incompleteData.completed) {
      user.account_status = AccountStatuses.MUST_REVALIDATE
      
      Event.emit('user::mustRevalidate', user)
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
    
    const toEmit = {
      user: result
    }
    
    // If the role has changed and the user was an agent
    if (userWasAgent || true) {
      toEmit.roleChangeData = roleChangeData
    }
    
    Event.emit('user::updated', toEmit)
    
    return result.full()
  }
  
  async delete ({ params }) {
    const user = await User.find(params.id)
    
    await user.delete()
  }
  
  /**
   *
   * @param {{response: AdonisHttpResponse}} param0
   */
  async sendActivationEmail ({ params, response }) {
    const user = await User.find(params.id)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    if (user.account_status === AccountStatuses.APPROVED) {
      // add this data only to pass them to the triggered event
      user.token = await Persona.generateToken(user, 'email')
      
      await user.save()
      
      user.sendOnlyEmail = true
      
      // Will send the welcome email with the link to activate the account
      Event.emit('user::approved', user)
    } else {
      throw new UserException('Invalid user status.')
    }
  }
  
  async changeStatus ({ params, request, auth }) {
    const userId = params.id
    const newStatus = request.input('status')
    
    const user = await User.find(userId)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    user.lastChangedBy = auth.user._id
    user.account_status = newStatus
    
    await user.save()
    
    return user.full()
  }
  
  async approve ({ params, auth, response }) {
    const user = await this._checkIncomingUser(params.id)
    
    if ([UserRoles.CLIENTE, UserRoles.AGENTE].includes(+user.role)) {
      // if (!auth.user.superAdmin) {
      throw new UserException('You can\'t perform this action.', UserException.statusCodes.FORBIDDEN)
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
    
    Event.emit('user::approved', user)
    
    return user.full()
  }
  
  async confirmDraft ({ params, auth, response }) {
    const userId = params.id
    const authUser = auth.user.toJSON()
    const authUserAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(authUser.role)
    
    const user = await this._checkIncomingUser(userId)
    
    // If user is cliente, then check the reference agent. Only he can change the status.
    if ([UserRoles.AGENTE, UserRoles.CLIENTE].includes(user.role)) {
      if (!user.contractImported) {
        /*if (user.referenceAgent && user.referenceAgent.toString() !== authUser.id && !authUserAdmin) {
          return response.badRequest("Permissions denied.")
        }*/
        
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
      return response.badRequest('User is not CLIENTE.')
    }
    
    await user.save()
    
    // I trigger validated as requested by issue #32
    Event.emit('user::' + user.account_status, user)
    
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
  async incomplete ({ params, auth, request, response }) {
    const userId = params.id
    const authUser = auth.user.toJSON()
    const incompleteData = request.only(['message', 'checkedFields'])
    
    if (authUser.role !== UserRoles.SERV_CLIENTI) {
      return response.unauthorized('Permission denied.')
    }
    
    const user = await User.find(userId)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    user.account_status = AccountStatuses.INCOMPLETE
    user.incompleteData = incompleteData
    
    delete user.incompleteData.completed
    
    await user.save()
    
    Event.emit('user::incomplete', user)
    
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
  async validate ({ params, auth, request, response }) {
    const userId = params.id
    const authUser = auth.user.toJSON()
    
    if (authUser.role !== UserRoles.SERV_CLIENTI) {
      return response.unauthorized('Permission denied.')
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
    
    Event.emit('user::validated', user)
    
    return user.full()
  }
  
  async importContract ({ request }) {
    const userId = request.input('userId')
    const fileToImport = request.file('fileToImport')
    
    /** @type {User} */
    const user = await User.find(userId)
    
    if (!user) {
      throw new Error('Can\'t find any user')
    }
    
    if (user.account_status === AccountStatuses.APPROVED && user.contractSignedAt) {
      return
    }
    
    if (!fileToImport) {
      throw new UserException('No file provided for import.')
    }
    
    user.incompleteData = null // reset existing incomplete data
    user.contractSignedAt = new Date()
    user.contractImported = true
    
    try {
      // Store the contract file in S3
      await File.store([fileToImport], user._id, user._id, {
        clientName: fileToImport.clientName,
        extname: 'pdf',
        fileName: 'null',
        fieldName: 'contractDoc',
        type: 'application',
        subtype: 'pdf'
      })
    } catch (er) {
      throw er
    }
    
    await user.save()
    
    return user.full()
  }
  
  me ({ auth, params }) {
    return auth.user
  }
  
  /**
   *
   * @param {HttpRequest} request
   * @param auth
   * @return {Promise<User[]|*|*[]>}
   */
  
  /*async getAll ({ request, auth }) {
    /!** @type {User} **!/
    const authUser = auth.user
    const userRole = +auth.user.role
    const requestRole = request.input('f')
    const allowedRoles = [AclUserRoles.ADMIN, AclUserRoles.AGENT, AclUserRoles.CLIENTS_SERVICE, AclUserRoles.SUPER_ADMIN, AclUserRoles.CLIENT]
    const agentAllowedRoles = [AclUserRoles.AGENT, AclUserRoles.CLIENT]
    
    // TODO:: unire questa funzione con quella dei filter, per non duplicare il codice
    
    if (!allowedRoles.includes(requestRole)) {
      throw new AclGenericException('You don\'t have permissions to access this resource.')
    }
    
    if (!(await AclProvider.checkPermissions([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ], auth))) {
      throw new AclGenericException()
    }
    
    // if user is agent, can filter by only the team roles (agent, clients)
    if (authUser.isAgent() && !agentAllowedRoles.includes(requestRole)) {
      throw new AclGenericException('You don\'t have permissions to access this resource.')
    }
    
    const filterRole = requestRole
    let match = {
      roles: requestRole
    }
    let returnFlat = false
    let project = null
    let result
    
    // Filter used for fetching agents list
    /!*    if (filterRole && +filterRole === UserRoles.AGENTE) {
          // match['role'] = { $in: [filterRole.toString(), +filterRole] }
          returnFlat = true
          project = {
            'firstName': 1,
            'lastName': 1,
            'role': 1,
            'roles': 1,
            'id': 1
          }
        }*!/
    
    // if the auth user is an agent, filter by only its users
    if (userRole === UserRoles.AGENTE) {
      match['referenceAgent'] = { $in: [auth.user._id.toString(), auth.user._id] }
    }
    
    /!*
    If the user is an agent and has subAgents and the filter for agents is active,
    return the list of all agents for the agents team
     *!/
    if (userRole === UserRoles.AGENTE) {
      // const hasSubAgents = (await auth.user.subAgents().fetch()).rows.length > 0
      
      /!* if (hasSubAgents) {
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
       }*!/
    }
    
    return await User.filter(match, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role',
      'roles',
      'account_status',
      'contractSignedAt',
      'contractPercentage',
      'contractImported',
      'contractNumber',
      'gold',
      'clubPack',
      'commissionsAssigned',
      'referenceAgent'
    ], request.pagination)
  }
  */
  /**
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<User[]|*|*[]>}
   */
  async getFiltered ({ request, auth }) {
    /** @type {User} **/
    const authUser = auth.user
    const authUserRole = +auth.user.role
    const allowedRoles = [AclUserRoles.ADMIN, AclUserRoles.AGENT, AclUserRoles.CLIENTS_SERVICE, AclUserRoles.SUPER_ADMIN, AclUserRoles.CLIENT, AclUserRoles.CLIENT + '_indirect']
    const agentAllowedRoles = [AclUserRoles.AGENT, AclUserRoles.CLIENT, AclUserRoles.CLIENT + '_indirect']
    
    if (!(await AclProvider.checkPermissions([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ], auth))) {
      throw new AclGenericException()
    }
    
    if (request.pagination.filters.roles) {
      if (!allowedRoles.includes(request.pagination.filters.roles)) {
        throw new AclGenericException('You don\'t have permissions to access this resource.')
      }
      
      // if user is agent, can filter by only the team roles (agent, clients)
      if (authUser.isAgent() && request.pagination.filters.roles && !agentAllowedRoles.includes(request.pagination.filters.roles)) {
        throw new AclGenericException('You don\'t have permissions to access this role users.')
      }
    }
    
    const filtersQuery = prepareFiltersQuery(request.pagination.filters, UserFiltersMap)
    
    // if the auth user is an agent, filter by only its users
    if (authUserRole === UserRoles.AGENTE) {
      // if the user is an agent allow filtering by other reference agent
      filtersQuery['referenceAgent'] = filtersQuery['referenceAgent'] || { $in: [auth.user._id.toString(), auth.user._id] }
    }
    
    // special fake role used to fetch all the users under an agent team leader
    if (filtersQuery.roles === AclUserRoles.CLIENT + '_indirect') {
      // first get a list of all agents under the team leader
      const subAgents = await User.getTeamAgents(authUser)
      const ids = subAgents.map(_agent => _agent._id).filter(_id => _id.toString() !== authUser._id.toString())
      
      delete filtersQuery.roles
      
      filtersQuery.referenceAgent = { $in: ids }
    }
    
    return await User.filter(filtersQuery, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role',
      'roles',
      'account_status',
      'contractSignedAt',
      'contractPercentage',
      'contractImported',
      'contractNumber',
      'gold',
      'clubPack',
      'commissionsAssigned',
      'referenceAgent'
    ], request.pagination)
  }
  
  /**
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<import('/@types/dto/GetCounters.dto').GetCountersDto[]>}
   */
  async getCounters ({ request, auth }) {
    /** @type {User} **/
    const authUser = auth.user
    const userRole = +auth.user.role
    
    if (!(await AclProvider.checkPermissions([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ], auth))) {
      throw new AclGenericException()
    }
    
    const match = {
      ...(prepareFiltersQuery(request.pagination.filters || {}, UserFiltersMap)),
      'role': {
        // By default, include only clients and agents in the counters
        '$in': [UserRoles.CLIENTE, UserRoles.AGENTE]
      }
    }
    
    // if the auth user is an admin, include all roles in the counters
    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
      match.role.$in.push(UserRoles.ADMIN, UserRoles.SERV_CLIENTI)
    }
    
    // if the auth user is an agent, filter by only its users
    if (userRole === UserRoles.AGENTE) {
      match['referenceAgent'] = { $in: [auth.user._id.toString(), auth.user._id] }
    }
    
    return User.getCounters(match)
  }
  
  /**
   * Return a list of all agents, necessary for the referenceAgent form select
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<*>}
   */
  async getSelectOptions ({ request, auth }) {
    // only clients can't read this list.
    if (auth.user.role === UserRoles.CLIENTE) {
      throw new AclGenericException()
    }
    
    return User.where({ role: UserRoles.AGENTE })
      .setVisible(['_id', 'firstName', 'lastName', 'referenceAgent'])
      .sort({ lastName: 1, firstName: 1 })
      .fetch()
  }
  
  /**
   *
   * @param {HttpRequest} request
   * @param auth
   * @return {Promise<{_id: string, count: number}[]>}
   */
  async getStatistics ({ request, auth }) {
    const userRole = +auth.user.role
    /**
     * @type {'accountStatuses'}
     */
    const type = request.input('type')
    const match = {}
    
    // if the auth user is an agent, filter by only its users
    if (userRole === UserRoles.AGENTE) {
      match['referenceAgent'] = { $in: [auth.user._id.toString(), auth.user._id] }
    }
    
    switch (type) {
      case 'accountStatuses':
        return User.getStatistics_accountStatus(match)
    }
  }
  
  async getValidatedUsers () {
    return await User.where({ account_status: AccountStatuses.VALIDATED }).fetch()
  }
  
  async getClientsList ({ params, auth }) {
    const user = auth.user
    const userRole = +auth.user.role
    const userId = params.id
    
    if (!(await AclProvider.checkPermissions([UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ], auth))) {
      throw new AclGenericException('Not enough permissions', AclGenericException.statusCodes.FORBIDDEN)
    }
    
    // The user is an agent, otherwise this call is useless
    const subAgentsList = await User.getTeamAgents(userId, true)
    const authUserIsParent = subAgentsList.find(el => el._id.toString() === userId)
    
    if (!authUserIsParent) {
      throw new AclGenericException('Not enough permissions', AclGenericException.statusCodes.FORBIDDEN)
    }
    
    const subAgentsIdList = subAgentsList.map(el => el._id.toString())
    
    return await User.getClientsList(userId, subAgentsIdList)
  }
  
  async getSignRequestLogs ({ params, auth }) {
    const userId = params.id
    const authUserAdmin = [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(auth.user.role)
    
    if (!authUserAdmin && userId !== auth.user._id.toString()) {
      throw new UserException('Action not allowed', 401)
    }
    
    const user = await User.find(userId)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    return user.fetchSigningLogs()
  }
  
  async getDeposit ({ params, auth }) {
    const user = await User.find(params.id)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    return user.getUserDeposit()
  }
  
  async resendContract ({ params, auth }) {
    const userId = params.id
    const authUser = auth.user.toJSON()
    
    if (authUser.role === UserRoles.CLIENTE) {
      return response.unauthorized('Permission denied.')
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
  
  async suspend ({ params, auth, request }) {
    const authUserAdmin = this._authUserAdmin(auth)
    
    if (!authUserAdmin) {
      throw new AclGenericException('Permessi insufficienti')
    }
    
    const user = await User.find(params.id)
    
    if (!user) {
      throw new UserNotFoundException()
    }
    
    user.suspended = Boolean(request.input('status'))
    
    await user.save()
    
    return {
      suspended: user.suspended
    }
  }
  
  async transferAgentUsers (oldAgent, newAgent) {
  
  }
  
  async transferAgentCommissions (oldAgent, newAgent) {
  
  }
  
  /**
   *
   * @param {{id: string, forceDownload: boolean}} params
   * @param {any} auth
   * @returns {Promise<void>}
   */
  async restoreSignedContract ({ params, auth, response }) {
    const userId = params.id
    const forceDownload = params.forceDownload
    
    if (!(await AclProvider.checkPermissions([UsersPermissions.ACL_USERS_ALL_WRITE], auth))) {
      throw new AclGenericException('Not enough permissions', AclGenericException.statusCodes.FORBIDDEN)
    }
    
    /**
     * @type {User}
     */
    const user = await User.findOrFail(userId)
    const sRUuid = user.contractSignRequestUuid
    
    if (!sRUuid || user.contractImported) {
      throw new UserException('User did not signed the contract inside the app, so no restore can be performed.', 401)
    }
    
    // cerco l'ultimo log del signRequest
    const signRequestLog = await SignRequestModel.where('uuid', user.contractSignRequestUuid).first()
    
    // controllo se signer_signed
    const signerSigned = signRequestLog.hooks.find(el => el.event_type === 'signer_signed')
    
    if (!signerSigned) {
      throw new Error('Signer not signed')
    }
    
    // retrieve document from signRequest
    // https://signrequest.com/api/v1/docs/#operation/documents_read
    const document = await DocSigner.getDocument(signerSigned.document.uuid)
    
    const filesToDelete = await File.where({
      'fieldName': { $in: ['contractDoc', 'contractDocSignLog'] },
      'userId': user._id
    }).fetch()
    
    // Store the contract file in S3
    await File.store([document.pdf], user._id, user._id, {
      clientName: document.name,
      extname: 'pdf',
      fileName: 'null',
      fieldName: 'contractDoc',
      type: 'application',
      subtype: 'pdf'
    })
    
    // Store the contract signature file in S3
    await File.store([document.signing_log.pdf], user._id, user._id, {
      clientName: document.name.replace('.pdf', '[SignLog].pdf'),
      extname: 'pdf',
      fileName: 'null',
      fieldName: 'contractDocSignLog',
      type: 'application',
      subtype: 'pdf'
    })
    
    // After uploading new files, removes the old ones
    await File.deleteAllWith(filesToDelete.rows.reduce((acc, el) => {
      acc.push(el._id)
      return acc
    }, []))
    
    return response.ok()
  }
}

module.exports = UserController
