'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const { resolver } = require('@adonisjs/fold')
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Route = use('Adonis/Src/Route')
const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')

class PolicyHandler {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle (ctx, next) {
    // get next route
    const nextRoute = Route.match(ctx.request.url(), ctx.request.method(), ctx.request.hostname())
  
    if (typeof nextRoute.route.handler !== 'string') {
      await next()
      return
    }
  
    // get next route handler function name
    const handlerFunctionName = nextRoute.route.handler.split('.').pop()
  
    // const controllerName = nextRoute.route.handler.split('.')[0]
  
    // get the instance of the controller that will handle the request
    const { instance } = resolver.forDir('httpControllers').resolveFunc(nextRoute.route.handler)
  
    // check if the controller has a policy and if it passes
    let policyPass = instance._checkPolicy ? instance._checkPolicy(handlerFunctionName, ctx) : true
    
    // handle async policy
    if (policyPass instanceof Promise) {
      policyPass = await policyPass
    }
    
    // if policy passes, go next, otherwise throw an exception
    if (policyPass) {
      // call next to advance the request
      await next()
    } else {
      throw new AclForbiddenException()
    }
  }
}

module.exports = PolicyHandler
