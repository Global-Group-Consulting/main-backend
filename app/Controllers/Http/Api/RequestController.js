'use strict'

/** @typedef {import('@adonisjs/framework/src/Params')} Params */
/** @typedef {import('../../../../@types/HttpResponse').AdonisHttpResponse} AdonisHttpResponse */
/**
 * @typedef {import('../../../../@types/HttpRequest').HttpRequest} HttpRequest
 * @typedef {import('../../../../@types/Request').Request} IRequest
 * @typedef {import('../../../../@types/Auth').Auth} Auth
 *  */

const { Types: MongoTypes } = require('mongoose')

/** @type {import('../../../Models/Request')} */
const RequestModel = use('App/Models/Request')

/** @type {typeof import('../../../Models/Movement')} */
const MovementModel = require('../../../Models/Movement')

/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = require('../../../Models/Commission')

/** @type {import('../../../Models/Request')} */
const UserModel = use('App/Models/User')
const FileModel = use('App/Models/File')
const AgentBrite = use('App/Models/AgentBrite')

/** @type {import('../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')
const Event = use('Event')
const { validate } = use('Validator')

const RequestNotFoundException = require('../../../Exceptions/RequestNotFoundException')
const RequestException = require('../../../Exceptions/RequestException')
const UserNotFoundException = require('../../../Exceptions/UserNotFoundException')
const AclGenericException = require('../../../Exceptions/Acl/AclGenericException')
const UserRoles = require('../../../../enums/UserRoles')
const RequestStatus = require('../../../../enums/RequestStatus')
const RequestTypes = require('../../../../enums/RequestTypes')
const MovementTypes = require('../../../../enums/MovementTypes')
const CurrencyType = require('../../../../enums/CurrencyType')
const AclUserRoles = require('../../../../enums/AclUserRoles')
const moment = require('moment')
const { castToObjectId } = require('../../../Helpers/ModelFormatters')
const { getCounters } = require('./requests/getCounters')
const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const RequestFiltersMap = require('../../../Filters/RequestFilters.map')

/**
 * @type {import('../../../../@types/SettingsProvider').SettingsProvider}
 */
const SettingsProvider = use('SettingsProvider')

class RequestController {
  getCounters = getCounters.bind(this)
  
  /**
   * Return all available requests for admin or for single user
   *
   * @param {Auth} auth
   * @param {HttpRequest} request
   * @return {Promise<*>}
   */
  async readAll ({ auth, request }) {
    const authIsAdmin = AclProvider.isAdmin(auth)
    const forId = request.pagination.filters.userId
    let filterUserId = null
  
    // it the auth user is not an admin, we show only his requests
    if (auth.user.isAgent() && forId) {
      // check if the user is a client of the agent
      const clientUser = await UserModel.where({ referenceAgent: auth.user._id, _id: castToObjectId(forId) }).first()
    
      if (clientUser) {
        filterUserId = clientUser._id
      } else {
        filterUserId = { $in: [auth.user._id.toString(), auth.user._id] }
      }
    } else if (!authIsAdmin) {
      // if user is an admin and no forId is specified, we show all requests that belongs to the user subagents and clients
      const subUserIds = await UserModel.getTeamUsersIds(auth.user, true, true)
      const userIds = await UserModel.getClientsList(auth.user._id, [], true)
  
      // filterUserId = { $in: [auth.user._id.toString(), auth.user._id] }
      filterUserId = { $in: [...subUserIds, ...userIds] }
    }
  
    if (filterUserId) {
      request.pagination.filters.userId = filterUserId
    }
  
    const filtersQuery = prepareFiltersQuery(request.pagination.filters, RequestFiltersMap)
  
    return await RequestModel.filter(filtersQuery, null, request.pagination)
  }
  
  /**
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {AdonisHttpResponse} ctx.response
   */
  async read ({ params, response }) {
    const data = await RequestModel.reqWithUser(params.id)
    
    if (data.type === RequestTypes.DEPOSIT_REPAYMENT) {
      data.availableAmount = await CommissionModel.getAvailableCommissions(data.userId)
    }
    
    if (!data) {
      throw new RequestNotFoundException()
    }
    
    return data
  }
  
  async readTargetUser ({ params }) {
    const id = params.id
    
    return UserModel.getTargetUser(id)
  }
  
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {AdonisHttpResponse} ctx.response
   */
  async create ({ request, response, auth }) {
    /** @type {typeof import('../../../Validators/requests/create').rules} */
    const incomingData = request.all()
    /** @type {import('../../../../@types/User').User} */
    const associatedUser = await UserModel.find(incomingData.userId)
    const settingsLimit = SettingsProvider.get('requestMinAmount')
    const settingsPercentage = SettingsProvider.get('requestBritePercentage')
    
    if (!associatedUser) {
      throw new UserNotFoundException()
    }
    
    if (!associatedUser.contractIban) {
      throw new RequestException('La richiesta non può essere inoltrata in quanto l\'utente non ha un IBAN associato. ')
    }
    
    incomingData.briteConversionPercentage = 0
    
    /*
    If the request is of type RISC_PROVVIGIONI, must calculate the percentage the user can collect
    and generate the brites movement
     */
    /*if (+incomingData.type === RequestTypes.RISC_PROVVIGIONI && settingsLimit !== null && settingsPercentage !== null && !incomingData.autoWithdrawlAll) {
      incomingData.amountOriginal = incomingData.amount;

      /!*
       If the amount is bigger than the limit, must calculate only a percentage to convert to brite,
       otherwise convert all to brites.
       *!/
      if (incomingData.amount > settingsLimit) {
        const briteAmount = incomingData.amount * settingsPercentage / 100;

        incomingData.amountBrite = briteAmount * 2;
        incomingData.amountEuro = incomingData.amount - briteAmount;
        incomingData.briteConversionPercentage = settingsPercentage
      } else {
        incomingData.amountBrite = incomingData.amount * 2;
        incomingData.briteConversionPercentage = 100
        incomingData.currency = CurrencyType.BRITE
      }

      // In tutti i casi genera un nuovo movimento brite
    }*/
    
    // cast to boolean  - No more required.
    if (incomingData.autoWithdrawlAll) {
      //incomingData.autoWithdrawlAll = incomingData.autoWithdrawlAll === "true"
      //incomingData.autoWithdrawlAllRecursively = incomingData.autoWithdrawlAllRecursively === "true"
      
      incomingData.amount = 0
    } else {
      if (!+incomingData.amount && ![RequestTypes.VERSAMENTO].includes(+incomingData.type)) {
        throw new RequestException('L\'importo della richiesta deve essere maggiore di 0.')
      }
    }
    
    const isAutoWithdrawlRequest = incomingData.autoWithdrawlAll
    
    if (incomingData.cards) {
      let cardsSum = 0
      
      incomingData.cards.forEach((el, i) => {
        incomingData.cards[i] = JSON.parse(el)
        /**
         * @type {{amount: number; id: string}}
         */
        const cardData = incomingData.cards[i]
        
        if (isNaN(+cardData.amount)) {
          cardData.amount = 0
        }
        
        cardsSum += cardData.amount
      })
      
      if (cardsSum !== incomingData.amount) {
        throw new RequestException('La somma degli importi delle carte prepagate è diverso dall\'importo richiesto.')
      }
    }
    
    /**
     * @type {IRequest}
     */
    const newRequest = await RequestModel.create({
      ...incomingData
    })
    
    if (incomingData.type === RequestTypes.RISC_PROVVIGIONI && !isAutoWithdrawlRequest) {
      newRequest.briteMovementId = await AgentBrite.addBritesFromRequest(newRequest)
      
      await newRequest.save()
    }
    
    const files = request.files()
    
    if (Object.keys(files).length > 0) {
      await FileModel.store(files, associatedUser._id, auth.user._id, {
        requestId: newRequest.id
      })
    }
    
    // avoid triggering notifications for autoWithdrawl requests
    if (!isAutoWithdrawlRequest) {
      Event.emit('request::new', newRequest)
    } else {
      associatedUser.autoWithdrawlAll = newRequest._id.toString()
      associatedUser.autoWithdrawlAllRecursively = newRequest.autoWithdrawlAllRecursively ? newRequest._id.toString() : null
      
      // Updates user's data by storing the autoWithdrawlAll id
      await associatedUser.save()
    }
    
    return newRequest
  }
  
  /**
   *
   * @param request
   * @param auth
   * @return {Promise<*>}
   */
  async createByAdmin ({ request, auth }) {
    if (auth.user.role !== UserRoles.ADMIN) {
      throw new AclGenericException('Permission denied', AclGenericException.statusCodes.FORBIDDEN)
    }
    
    /** @type {typeof import('../../../Validators/requests/create').rules} */
    const incomingData = request.all()
  
    // ensure the value is a boolean
    incomingData.clubRepayment = incomingData.clubRepayment === 'true';
    
    /** @type {import('../../../../@types/User').User} */
    const associatedUser = await UserModel.find(incomingData.userId)
    
    if (!associatedUser) {
      throw new UserNotFoundException()
    }
    
    if (!+incomingData.amount) {
      throw new RequestException('L\'importo della richiesta deve essere maggiore di 0.')
    }
    
    let newRequest = null
    
    if ([RequestTypes.RISC_MANUALE_INTERESSI, RequestTypes.DEPOSIT_REPAYMENT].includes(+incomingData.type)) {
      let movementType
      
      switch (+incomingData.type) {
        case RequestTypes.RISC_MANUALE_INTERESSI:
          movementType = MovementTypes.MANUAL_INTEREST_COLLECTED
          break
        case RequestTypes.DEPOSIT_REPAYMENT:
          movementType = MovementTypes.DEPOSIT_REPAYMENT
          break
      }
      
      newRequest = await MovementModel.addRepaymentMovement({
        ...incomingData,
        requestType: incomingData.type,
        createdBy: auth.user.id,
        createdByAdmin: true,
        interestPercentage: associatedUser.contractPercentage,
        app: incomingData.clubRepayment ? 'club' : null
      })
    } else {
      newRequest = await RequestModel.create({
        ...incomingData,
        createdBy: auth.user.id,
        createdByAdmin: true
      })
      
      const files = request.files()
      
      if (Object.keys(files).length > 0) {
        await FileModel.store(files, associatedUser._id, auth.user._id, {
          requestId: newRequest.id
        })
      }
      
      Event.emit('request::new', newRequest)
    }
    
    return newRequest
  }
  
  async createByAgent ({ request, auth }) {
    if (!auth.user.roles.includes(AclUserRoles.AGENT)) {
      throw new AclGenericException('Permission denied', AclGenericException.statusCodes.FORBIDDEN)
    }
    
    /** @type {typeof import('../../../Validators/requests/create').rules} */
    const incomingData = request.all()
    
    /** @type {import('../../../../@types/User').User} */
    const associatedUser = await UserModel.find(incomingData.userId)
    
    if (!associatedUser) {
      throw new UserNotFoundException()
    }
    
    if (!+incomingData.amount) {
      throw new RequestException('L\'importo della richiesta deve essere maggiore di 0.')
    }
    
    if (incomingData.type === RequestTypes.DEPOSIT_REPAYMENT && !incomingData.notes) {
      throw new RequestException('Motivazione richiesta mancante')
    }
    
    let newRequest = await RequestModel.create({
      ...incomingData,
      userId: auth.user._id,
      createdBy: auth.user._id,
      targetUserId: castToObjectId(incomingData.userId)
    })
    
    Event.emit('request::new', newRequest)
  }
  
  /**
   * I disabled the update so that the requests can't be changed. If necessary thy can be deleted and recreated.
   *
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {Request} ctx.request
   * @param {AdonisHttpResponse} ctx.response
   */
  
  /* async update({ params, request, response }) {
    const incomingData = request.all()
    const existingRequest = await RequestModel.find(params.id)

    if (!existingRequest) {
      throw new RequestNotFoundException()
    }

    existingRequest.merge(incomingData)

    await existingRequest.save()

    return existingRequest
  } */
  
  /**
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {AdonisHttpResponse} ctx.response
   */
  async delete ({ params, response, auth }) {
    const foundedRequest = await RequestModel.find(params.id)
    
    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }
    
    if (+foundedRequest.status !== RequestStatus.NUOVA
      || auth.user._id.toString() !== foundedRequest.userId.toString()) {
      return response.badRequest('Can\'t delete request.')
    }
    
    const result = await foundedRequest.delete()
    
    Event.emit('request::cancelled', foundedRequest)
    
    if (result) {
      return response.ok()
    } else {
      return response.badRequest('Can\'t delete request.')
    }
  }
  
  async approve ({ params, response, request, auth }) {
    const requestId = params.id
    const foundedRequest = await RequestModel.find(requestId)
    const incomingDate = request.input('paymentDocDate')
    const incomingAmount = request.input('paymentAmount')
    const incomingGoldAmount = request.input('paymentGoldAmount')
    
    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }
    
    if (![RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(+foundedRequest.status)) {
      return response.badRequest('Can\'t change request status.')
    }
    
    const minMonthDate = moment().subtract(1, 'months')
      .set({
        'date': 1,
        'hour': 0,
        'minute': 0,
        'second': 0,
        'millisecond': 0
      })
    
    // Assure that the date is not older then 1st of previous month
    if ((minMonthDate.isAfter(incomingDate))) {
      throw new RequestException('The provided date is older the the 1st of the previous month.')
    }
    
    const minCurrentMonthDate = moment().set({
      'date': 1,
      'hour': 0,
      'minute': 0,
      'second': 0,
      'millisecond': 0
    })
    /*
    If the current date is > 15, and the date refers to the precious month,
    then it means that the recapitalization has
    already occurred and also the agents commission calculation, so we can't add
    a movement on the previous month.
     */
    if (moment().date() > 15 && minCurrentMonthDate.isAfter(incomingDate)) {
      throw new RequestException('The provided date can\'t be precedent to the 1st of the current month because the recapitalization has already occurred.')
    }
    
    if (!isNaN(incomingAmount) && foundedRequest.amount !== +incomingAmount) {
      foundedRequest.originalAmount = foundedRequest.amount
      foundedRequest.amount = +incomingAmount
    }
    
    if (!isNaN(incomingGoldAmount) && foundedRequest.goldAmount !== +incomingGoldAmount) {
      foundedRequest.originalGoldAmount = foundedRequest.goldAmount
      foundedRequest.goldAmount = +incomingGoldAmount
    }
    
    foundedRequest.status = RequestStatus.ACCETTATA
    foundedRequest.paymentDocDate = incomingDate
    foundedRequest.completedBy = auth.user._id
    foundedRequest.completed_at = new Date()
    
    await foundedRequest.save()
    
    if (foundedRequest.type === RequestTypes.DEPOSIT_REPAYMENT) {
      try {
        // If is a repayment, subtract the amount of commissions and add them as deposit to the user
        foundedRequest.movementId = await this.handleAgentDepositRepayment(foundedRequest)
        
        foundedRequest.save()
      } catch (er) {
        // Reset the request state
        foundedRequest.status = RequestStatus.NUOVA
        foundedRequest.paymentDocDate = null
        foundedRequest.completedBy = null
        foundedRequest.completed_at = null
        
        foundedRequest.save()
        
        throw er
      }
    }
    
    Event.emit('request::approved', foundedRequest)
    
    return foundedRequest
  }
  
  async reject ({ request, params, response }) {
    const requestId = params.id
    const reason = request.input('reason')
    const foundedRequest = await RequestModel.find(requestId)
    
    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }
    
    if (![RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(+foundedRequest.status)) {
      return response.badRequest('Can\'t change request status.')
    }
    
    foundedRequest.status = RequestStatus.RIFIUTATA
    foundedRequest.rejectReason = reason
    foundedRequest.completed_at = new Date()
    
    await foundedRequest.save()
    
    Event.emit('request::rejected', foundedRequest)
    
    return foundedRequest
  }
  
  async cancel ({ request, params, response }) {
    const requestId = params.id
    const reason = request.input('reason')
    const foundedRequest = await RequestModel.find(requestId)
    
    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }
    
    const isAutoWithdrawlRequest = !!foundedRequest.autoWithdrawlAll
    
    /*
    Can't cancel a request if this is not autoWithdrawlRequest and not "accettata"
    OR
    is an autoWithdrawlRequest and is not in "lavorazione"
     */
    if ((!isAutoWithdrawlRequest && +foundedRequest.status !== RequestStatus.ACCETTATA)
      || (isAutoWithdrawlRequest && +foundedRequest.status !== RequestStatus.LAVORAZIONE)) {
      return response.badRequest('Can\'t cancel this request.')
    }
    
    foundedRequest.status = RequestStatus.ANNULLATA
    foundedRequest.cancelReason = reason || ''
    foundedRequest.completed_at = new Date().toISOString()
    
    if (isAutoWithdrawlRequest) {
      // Create a prop that immediately show if the request has been disabled.
      // This prop will be used for fetching if already exist a request of this type.
      foundedRequest.autoWithdrawlAllRevoked = true
      
      const associatedUser = await foundedRequest.user().fetch()
      
      associatedUser.autoWithdrawlAll = null
      associatedUser.autoWithdrawlAllRecursively = null
      
      // Updates user's data by resetting the autoWithdrawlAll
      await associatedUser.save()
    }
    
    await foundedRequest.save()
    
    // avoid triggering notifications for autoWithdrawl requests
    if (!isAutoWithdrawlRequest) {
      Event.emit('request::cancelled', foundedRequest)
    }
    
    return foundedRequest
  }
  
  /**
   * Metodo che effettua lo storno di una richiesta, lato admin.
   * Deve controllare anche il movimento relativo a quella richiesta,
   * oltre che le eventuali provvigioni generate.
   *
   * @param {Request} request
   * @param {{id: string}} params
   * @param {Response} response
   * @return {Promise<void>}
   */
  async revert ({ request, params, response }) {
    /** @type {string} */
    const requestId = params.id
    
    /** @type {Comprehend.SentimentScore.Mixed} */
    const reason = request.input('reason')
    
    /** @type {IRequest} */
    const reqToRevert = await RequestModel.find(requestId)
    
    if (!reqToRevert) {
      throw new RequestNotFoundException()
    }
    
    if (!RequestModel.revertableRequests.includes(reqToRevert.type)) {
      return response.badRequest('Can\'t revert this type of request.')
    }
    
    reqToRevert.status = RequestStatus.ANNULLATA
    reqToRevert.cancelReason = reason || ''
    reqToRevert.completed_at = moment().toDate()
    
    await reqToRevert.save()
    
    Event.emit('request::reverted', reqToRevert)
  }
  
  /**
   *
   * @param {IRequest} request
   * @returns {Promise<void>}
   */
  async handleAgentDepositRepayment (request) {
    let agentCommissionMovement
    let userDepositMovement
    
    try {
      // Subtract agent commissions
      agentCommissionMovement = await CommissionModel.repaymentTransfer({
        amountChange: request.amount,
        notes: request.notes,
        userId: request.userId,
        created_by: request.userId,
        dateReference: request.paymentDocDate
      })
      
      // Add user deposit
      const targetUser = await UserModel.find(request.targetUserId)
      
      userDepositMovement = await MovementModel.addRepaymentMovement({
        userId: request.targetUserId,
        amount: request.amount,
        requestType: request.type,
        createdBy: request.userId,
        interestPercentage: targetUser.contractPercentage,
        notes: request.notes
      })
      
      return agentCommissionMovement._id
    } catch (er) {
      // In case of error, delete generated movements
      if (agentCommissionMovement) {
        agentCommissionMovement.delete()
      }
      if (userDepositMovement) {
        userDepositMovement.delete()
      }
  
      throw er
    }
  }
  
  async storeAttachments ({ params, request, auth, response }) {
    const requestId = params.id
    const existingRequest = await RequestModel.findOrFail(requestId)
    const files = request.files()
    const validation = await validate(request.files(), {
      requestAttachment: 'required|file|size:4500'
    })
    
    if (validation.fails()) {
      return response.badRequest(validation.messages())
    }
    
    if (Object.keys(files).length > 0) {
      if (existingRequest.initialMovement) {
        files['requestAttachment'].fieldName = 'contractInvestmentAttachment'
        files['contractInvestmentAttachment'] = files['requestAttachment']
    
        delete files['requestAttachment']
      }
  
      const storedFiles = await FileModel.store(files, (existingRequest.userId.toString()), auth.user._id, {
        requestId: existingRequest._id
      })
  
      return storedFiles
    }
  }
}

module.exports = RequestController
