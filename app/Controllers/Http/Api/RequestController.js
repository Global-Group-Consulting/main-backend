'use strict'

/** @typedef {import('@adonisjs/framework/src/Params')} Params */
/** @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse */
/** @type {import("../../../Models/Request")} */

const RequestModel = use("App/Models/Request")
const RequestNotFoundException = require("../../../Exceptions/RequestNotFoundException")

class RequestController {

  async readAll() {
    const data = await RequestModel.all()

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
  async create({ request, response }) {
    const incomingData = request.all()

    const newRequest = await RequestModel.create(incomingData)

    return newRequest
  }

  /**
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {Request} ctx.request
   * @param {AdonisHttpResponse} ctx.response
   */
  async update({ params, request, response }) {
    const incomingData = request.all()
    const existingRequest = await RequestModel.find(params.id)

    if (!existingRequest) {
      throw new RequestNotFoundException()
    }

    existingRequest.merge(incomingData)

    await existingRequest.save()

    return existingRequest
  }

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

}

module.exports = RequestController
