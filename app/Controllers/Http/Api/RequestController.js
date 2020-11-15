'use strict'

/** @typedef {import('@adonisjs/framework/src/Params')} Params */
/** @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse */

/** @type {import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")

const RequestNotFoundException = require("../../../Exceptions/RequestNotFoundException")
const UserNotFoundException = require("../../../Exceptions/UserNotFoundException")
const UserRoles = require("../../../../enums/UserRoles")
const RequestStatus = require("../../../../enums/RequestStatus")


/** @type {import("../../../Models/Request")} */
const UserModel = use("App/Models/User")
const FileModel = use("App/Models/File")

class RequestController {

  async readAll({ auth }) {
    const adminUser = [UserRoles.SERV_CLIENTI, UserRoles.ADMIN].includes(+auth.user.role)
    const sorting = { "created_at": -1, "updated_at": -1, "completed_at": -1, "firstName": 1, "lastname": 1 }
    const filter = adminUser ? {} : { userId: auth.user.id.toString() }

    if (adminUser) {
      return await RequestModel.allWithUser()
    }

    const data = await RequestModel.where(filter).sort(sorting).fetch()

    return data
  }

  /**
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {AdonisHttpResponse} ctx.response
   */
  async read({ params, response }) {
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
  async create({ request, response, auth }) {
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
      await FileModel.store(files, associatedUser.id, auth.user.id, {
        requestId: newRequest.id
      })
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
  async delete({ params, response }) {
    const foundedRequest = await RequestModel.find(params.id)

    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }

    const result = await foundedRequest.delete()

    if (result) {
      return response.ok()
    } else {
      return response.badRequest("Can't delete request.")
    }
  }

  async approve({ params, response }) {
    const requestId = params.id
    const foundedRequest = await RequestModel.find(requestId)

    if (!foundedRequest) {
      throw new RequestNotFoundException()
    }

    if (+foundedRequest.status !== RequestStatus.NUOVA) {
      return response.badRequest("Can't change request status.")
    }

    foundedRequest.status = RequestStatus.ACCETTATA
    foundedRequest.completed_at = new Date()

    await foundedRequest.save()

    return foundedRequest
  }

  async reject({ request, params, response }) {
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

    return foundedRequest
  }
}

module.exports = RequestController
