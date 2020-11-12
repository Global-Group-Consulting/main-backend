'use strict'

/** @typedef {import('@adonisjs/framework/src/Params')} Params */
/** @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse */
/** @type {import("../../../Models/Request")} */

const RequestModel = use("App/Models/Request")

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
      return response.badRequest()
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
      return response.badRequest()
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
  async delete({ params, response }) { }

}

module.exports = RequestController
