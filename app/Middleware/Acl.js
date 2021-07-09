'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const AclProvider = use("AclProvider")
const AclForbiddenException = use("App/Exceptions/Acl/AclForbiddenException")

class Acl {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   * @param {string[]} properties
   */
  async handle({request, auth}, next, properties) {
    const permissions = properties.map(perm => perm.replace(/!/g, ":"))

    debugger
    const canAccess = await AclProvider.checkPermissions(permissions, auth);

    if (!canAccess) {
      throw new AclForbiddenException()
    }

    // call next to advance the request
    await next()
  }
}

module.exports = Acl
