'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('../../@types/HttpResponse').ResponseDescriptiveMethods} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')
const UserRoles = require('../../enums/UserRoles')

class AuthByRole {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   * @param {AclUserRoles[]} requiredRoles
   */
  async handle ({ request, auth, response }, next, requiredRoles) {
    if (!auth.authenticatorInstance.user) {
      return response.unauthorized()
    }
    
    const userRoles = auth.authenticatorInstance.user.roles
    
    // if none of the requiredRoles are in the userRoles, unauthorized
    if (!requiredRoles.find(role => userRoles.includes(role))) {
      return response.unauthorized()
    }
    
    await next()
  }
}

module.exports = AuthByRole
