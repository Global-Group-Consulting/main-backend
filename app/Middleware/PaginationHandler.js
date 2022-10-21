'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PaginationHandler {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    
    let page = +(request.input('page') || 1)
    let limit = +(request.input('limit') || 20)
    
    if (page < 1 || isNaN(page)) {
      page = 1
    }
    
    if (limit < 1 || isNaN(limit)) {
      limit = 20
    }
    
    let filters = {}
    
    if (request.input('filters')) {
      try {
        filters = JSON.parse(request.input('filters'))
      } catch (e) {
        // can't parse filters
      }
    }
    
    request.pagination = {
      page,
      limit,
      sortBy: request.input('sortBy') || [],
      sortDesc: (request.input('sortDesc') || []).map((item) => item === 'true'),
      filters
    }
    
    await next()
  }
}

module.exports = PaginationHandler
