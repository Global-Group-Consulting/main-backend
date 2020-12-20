'use strict'

/** @typedef {import('@adonisjs/framework/src/Params')} Params */
/** @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse */

const {Types: MongoTypes} = require('mongoose');

/** @type {typeof import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")

/** @type {typeof import("../../../Models/Movement")} */
const MovementModel = require('../../../Models/Movement')

/** @type {import("../../../Models/Request")} */
const UserModel = use("App/Models/User")
const FileModel = use("App/Models/File")
const Event = use("Event")

const RequestNotFoundException = require("../../../Exceptions/RequestNotFoundException")
const RequestException = require("../../../Exceptions/RequestException")
const UserNotFoundException = require("../../../Exceptions/UserNotFoundException")
const UserRoles = require("../../../../enums/UserRoles")
const RequestStatus = require("../../../../enums/RequestStatus")
const MovementTypes = require("../../../../enums/MovementTypes")
const moment = require("moment")


class RequestController {

  async readAll({auth}) {
    const adminUser = [UserRoles.SERV_CLIENTI, UserRoles.ADMIN].includes(+auth.user.role)
    const sorting = {"created_at": -1, "updated_at": -1, "completed_at": -1, "firstName": 1, "lastname": 1}
    const filter = adminUser ? {} : {userId: {$in: [auth.user._id.toString(), new MongoTypes.ObjectId(auth.user._id)]}}

    if (adminUser) {
      return await RequestModel.allWithUser(sorting)
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
    const data = await RequestModel.find(params.id)

    if (!data) {
      throw new RequestNotFoundException()
    }

    return data
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

    if (!associatedUser) {
      throw new UserNotFoundException()
    }

    const newRequest = await RequestModel.create({
      ...incomingData
    })

    const files = request.files()

    if (Object.keys(files).length > 0) {
      await FileModel.store(files, associatedUser.id, auth.user._id, {
        requestId: newRequest.id
      })
    }

    Event.emit("request::new", newRequest)

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

  async approve({params, response, request}) {
    const requestId = params.id
    const foundedRequest = await RequestModel.find(requestId)
    const incomingDate = request.input("paymentDocDate")

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

    foundedRequest.status = RequestStatus.ACCETTATA
    foundedRequest.paymentDocDate = incomingDate
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

    if (+foundedRequest.status !== RequestStatus.NUOVA) {
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

    if (+foundedRequest.status !== RequestStatus.ACCETTATA) {
      return response.badRequest("Can't cancel this request.")
    }

    foundedRequest.status = RequestStatus.ANNULLATA
    foundedRequest.cancelReason = reason
    foundedRequest.completed_at = new Date().toISOString()

    await foundedRequest.save()

    Event.emit("request::cancelled", foundedRequest)

    return foundedRequest
  }
}

module.exports = RequestController
