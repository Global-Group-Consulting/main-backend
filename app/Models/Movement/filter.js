const { prepareSorting, preparePaginatedResult } = require('../../Utilities/Pagination')
const { AggregationBuilder } = require('../../../classes/AggregationBuilder')
const { omit, clone } = require('lodash')

const User = use('App/Models/User')

/**
 * @param {any} filter
 * @param {any} project
 * @param {import('/@types/HttpRequest').RequestPagination} requestPagination
 * @return {Promise<PaginatedResult>}
 */
module.exports.filter = async function (filter = {}, project, requestPagination) {
  // store original filter to use it later when returning the result
  const originalFilter = clone(filter)
  let sort = prepareSorting(requestPagination /*{ 'created_at': -1, 'updated_at': -1, 'completed_at': -1 }*/)
  
  const start = Date.now()
  
  let result = (await this.where(filter)
    .setVisible(project, null)
    .sort(sort)
    .paginate(requestPagination.page)).toJSON()
  
  const end = Date.now()
  
  result.time = end - start
  
  return preparePaginatedResult(result, sort, originalFilter)
}


