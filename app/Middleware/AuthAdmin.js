'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('../../@types/HttpResponse').ResponseDescriptiveMethods} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use("Env")
const UserRoles = require("../../enums/UserRoles")

class AuthSuperAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({request, auth, response}, next) {

    if (request.hostname() === "localhost" && request.headers()["user-agent"].startsWith("PostmanRuntime") && Env.get("NODE_ENV") === "development") {
      return next()
    }

    if (!auth.authenticatorInstance.user) {
      return response.unauthorized()
    }

    const userRole = auth.authenticatorInstance.user.role

    if (![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
      return response.unauthorized()
    }

    await next()
  }
}

module.exports = AuthSuperAdmin
