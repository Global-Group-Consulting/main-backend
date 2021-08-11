'use strict'

/** @typedef {import('@adonisjs/framework/src/Params')} Params */
/** @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse */
/** @typedef {import("../../../../@types/Request").Request} IRequest */

const {Types: MongoTypes} = require('mongoose');

/** @type {typeof import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")

/** @type {typeof import("../../../Models/Movement")} */
const MovementModel = require('../../../Models/Movement')

/** @type {import("../../../Models/Request")} */
const UserModel = use("App/Models/User")
const FileModel = use("App/Models/File")
const AgentBrite = use("App/Models/AgentBrite")
const Event = use("Event")

const RequestNotFoundException = require("../../../Exceptions/RequestNotFoundException")
const RequestException = require("../../../Exceptions/RequestException")
const UserNotFoundException = require("../../../Exceptions/UserNotFoundException")
const AclGenericException = require("../../../Exceptions/Acl/AclGenericException")
const UserRoles = require("../../../../enums/UserRoles")
const RequestStatus = require("../../../../enums/RequestStatus")
const RequestTypes = require("../../../../enums/RequestTypes")
const MovementTypes = require("../../../../enums/MovementTypes")
const CurrencyType = require("../../../../enums/CurrencyType")
const moment = require("moment")

/**
 * @type {import("../../../../@types/SettingsProvider").SettingsProvider}
 */
const SettingsProvider = use("SettingsProvider")

class RequestController {
  async readAll({auth, transform}) {
    const adminUser = [UserRoles.SERV_CLIENTI, UserRoles.ADMIN].includes(+auth.user.role)
    const sorting = {"created_at": -1, "updated_at": -1, "completed_at": -1}
    const filter = adminUser ? {} : {userId: {$in: [auth.user._id.toString(), new MongoTypes.ObjectId(auth.user._id)]}}

    if (adminUser) {
      const data = await RequestModel.allWithUserPaginated(sorting)

      return transform.collection(data, "RequestsTransformer")
    }

    // const data = await RequestModel.where(filter).sort(sorting).fetch()
    return await RequestModel.allForUser(auth.user._id, sorting)
  }

  /**
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {AdonisHttpResponse} ctx.response
   */
  async read({params, response}) {
    const data = await RequestModel.reqWithUser(params.id)

    if (!data) {
      throw new RequestNotFoundException()
    }

    return data
  }

  async readTargetUser({params}) {
    const id = params.id

    return UserModel.getTargetUser(id)
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {AdonisHttpResponse} ctx.response
   */
  async create({request, response, auth}) {
    /** @type {typeof import("../../../Validators/requests/create").rules} */
    const incomingData = request.all()
    /** @type {import("../../../../@types/User").User} */
    const associatedUser = await UserModel.find(incomingData.userId)
    const settingsLimit = SettingsProvider.get("requestMinAmount");
    const settingsPercentage = SettingsProvider.get("requestBritePercentage");

    if (!associatedUser) {
      throw new UserNotFoundException()
    }

    incomingData.briteConversionPercentage = 0;

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

      incomingData.amount = 0;
    } else {
      if (!+incomingData.amount && ![RequestTypes.VERSAMENTO].includes(+incomingData.type)) {
        throw new RequestException("L'importo della richiesta deve essere maggiore di 0.")
      }
    }

    const isAutoWithdrawlRequest = incomingData.autoWithdrawlAll;

    /**
     * @type {IRequest}
     */
    const newRequest = await RequestModel.create({
      ...incomingData
    })

    if (incomingData.type === RequestTypes.RISC_PROVVIGIONI && !isAutoWithdrawlRequest) {
      newRequest.briteMovementId = await AgentBrite.addBritesFromRequest(newRequest)

      await newRequest.save();
    }

    const files = request.files()

    if (Object.keys(files).length > 0) {
      await FileModel.store(files, associatedUser.id, auth.user._id, {
        requestId: newRequest.id
      })
    }

    // avoid triggering notifications for autoWithdrawl requests
    if (!isAutoWithdrawlRequest) {
      Event.emit("request::new", newRequest)
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
  async createByAdmin({request, auth}) {
    if (auth.user.role !== UserRoles.ADMIN) {
      throw new AclGenericException("Permission denied", AclGenericException.statusCodes.FORBIDDEN)
    }

    /** @type {typeof import("../../../Validators/requests/create").rules} */
    const incomingData = request.all()

    /** @type {import("../../../../@types/User").User} */
    const associatedUser = await UserModel.find(incomingData.userId)

    if (!associatedUser) {
      throw new UserNotFoundException()
    }

    if (!+incomingData.amount) {
      throw new RequestException("L'importo della richiesta deve essere maggiore di 0.")
    }

    let newRequest = null;

    if (+incomingData.type === RequestTypes.RISC_MANUALE_INTERESSI) {
      if(!auth.user.superAdmin){
        throw new AclGenericException("Permessi insufficienti!")
      }

      const movementData = {
        userId: incomingData.userId,
        movementType: MovementTypes.MANUAL_INTEREST_COLLECTED,
        requestType: incomingData.type,
        amountChange: incomingData.amount,
        createdBy: auth.user.id,
        createdByAdmin: true,
        interestPercentage: associatedUser.contractPercentage,
        notes: incomingData.notes
      }

      newRequest = await MovementModel.create(movementData);
    } else {
      newRequest = await RequestModel.create({
        ...incomingData,
        createdBy: auth.user.id,
        createdByAdmin: true
      })

      const files = request.files()

      if (Object.keys(files).length > 0) {
        await FileModel.store(files, associatedUser.id, auth.user._id, {
          requestId: newRequest.id
        })
      }

      Event.emit("request::new", newRequest)
    }

    return newRequest

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
  async delete({params, response, auth}) {
    const foundedRequest = await RequestModel.find(params.id)

    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }

    if (+foundedRequest.status !== RequestStatus.NUOVA
      || auth.user._id.toString() !== foundedRequest.userId.toString()) {
      return response.badRequest("Can't delete request.")
    }

    const result = await foundedRequest.delete()

    Event.emit("request::cancelled", foundedRequest)

    if (result) {
      return response.ok()
    } else {
      return response.badRequest("Can't delete request.")
    }
  }

  async approve({params, response, request, auth}) {
    const requestId = params.id
    const foundedRequest = await RequestModel.find(requestId)
    const incomingDate = request.input("paymentDocDate")
    const incomingAmount = request.input("paymentAmount")
    const incomingGoldAmount = request.input("paymentGoldAmount")

    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }

    if (![RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(+foundedRequest.status)) {
      return response.badRequest("Can't change request status.")
    }

    const minMonthDate = moment().subtract(1, "months")
      .set({
        'date': 1,
        'hour': 0,
        "minute": 0,
        "second": 0,
        "millisecond": 0
      })

    // Assure that the date is not older then 1st of previous month
    if ((minMonthDate.isAfter(incomingDate))) {
      throw new RequestException("The provided date is older the the 1st of the previous month.")
    }

    const minCurrentMonthDate = moment().set({
      'date': 1,
      'hour': 0,
      "minute": 0,
      "second": 0,
      "millisecond": 0
    })
    /*
    If the current date is > 15, and the date refers to the precious month,
    then it means that the recapitalization has
    already occurred and also the agents commission calculation, so we can't add
    a movement on the previous month.
     */
    if (moment().date() > 15 && minCurrentMonthDate.isAfter(incomingDate)) {
      throw new RequestException("The provided date can't be precedent to the 1st of the current month because the recapitalization has already occurred.")
    }

    if (!isNaN(incomingAmount) && foundedRequest.amount !== +incomingAmount) {
      foundedRequest.originalAmount = foundedRequest.amount;
      foundedRequest.amount = +incomingAmount;
    }

    if (!isNaN(incomingGoldAmount) && foundedRequest.goldAmount !== +incomingGoldAmount) {
      foundedRequest.originalGoldAmount = foundedRequest.goldAmount;
      foundedRequest.goldAmount = +incomingGoldAmount;
    }

    foundedRequest.status = RequestStatus.ACCETTATA
    foundedRequest.paymentDocDate = incomingDate
    foundedRequest.completedBy = auth.user._id;
    foundedRequest.completed_at = new Date()

    await foundedRequest.save()

    Event.emit("request::approved", foundedRequest)

    return foundedRequest
  }

  async reject({request, params, response}) {
    const requestId = params.id
    const reason = request.input("reason")
    const foundedRequest = await RequestModel.find(requestId)

    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }

    if (![RequestStatus.NUOVA, RequestStatus.LAVORAZIONE].includes(+foundedRequest.status)) {
      return response.badRequest("Can't change request status.")
    }

    foundedRequest.status = RequestStatus.RIFIUTATA
    foundedRequest.rejectReason = reason
    foundedRequest.completed_at = new Date()

    await foundedRequest.save()

    Event.emit("request::rejected", foundedRequest)

    return foundedRequest
  }

  async cancel({request, params, response}) {
    const requestId = params.id
    const reason = request.input("reason")
    const foundedRequest = await RequestModel.find(requestId)

    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }

    const isAutoWithdrawlRequest = !!foundedRequest.autoWithdrawlAll;

    /*
    Can't cancel a request if this is not autoWithdrawlRequest and not "accettata"
    OR
    is an autoWithdrawlRequest and is not in "lavorazione"
     */
    if ((!isAutoWithdrawlRequest && +foundedRequest.status !== RequestStatus.ACCETTATA)
      || (isAutoWithdrawlRequest && +foundedRequest.status !== RequestStatus.LAVORAZIONE)) {
      return response.badRequest("Can't cancel this request.")
    }

    foundedRequest.status = RequestStatus.ANNULLATA
    foundedRequest.cancelReason = reason || ""
    foundedRequest.completed_at = new Date().toISOString()

    if (isAutoWithdrawlRequest) {
      // Create a prop that immediately show if the request has been disabled.
      // This prop will be used for fetching if already exist a request of this type.
      foundedRequest.autoWithdrawlAllRevoked = true;

      const associatedUser = await foundedRequest.user().fetch()

      associatedUser.autoWithdrawlAll = null
      associatedUser.autoWithdrawlAllRecursively = null

      // Updates user's data by resetting the autoWithdrawlAll
      await associatedUser.save()
    }

    await foundedRequest.save()

    // avoid triggering notifications for autoWithdrawl requests
    if (!isAutoWithdrawlRequest) {
      Event.emit("request::cancelled", foundedRequest)
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
  async revert({request, params, response}) {
    /** @type {string} */
    const requestId = params.id

    /** @type {Comprehend.SentimentScore.Mixed} */
    const reason = request.input("reason")

    /** @type {IRequest} */
    const reqToRevert = await RequestModel.find(requestId)

    if (!reqToRevert) {
      throw new RequestNotFoundException()
    }

    if (!RequestModel.revertableRequests.includes(reqToRevert.type)) {
      return response.badRequest("Can't revert this type of request.")
    }

    reqToRevert.status = RequestStatus.ANNULLATA
    reqToRevert.cancelReason = reason || ""
    reqToRevert.completed_at = moment().toDate()

    await reqToRevert.save();

    Event.emit("request::reverted", reqToRevert)
  }
}

module.exports = RequestController
