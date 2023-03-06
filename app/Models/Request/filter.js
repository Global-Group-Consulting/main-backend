const { prepareSorting, preparePaginatedResult } = require('../../Utilities/Pagination')
const { AggregationBuilder } = require('../../../classes/AggregationBuilder')
const { omit, clone } = require('lodash')
const { castToObjectId } = require('../../Helpers/ModelFormatters')

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
  
  // If referenceAgent is required,
  // first we fetch the user with the given referenceAgent,
  // then we add the user's id to the filter so that we can filter by it
  // and speed up the query
  if (filter.referenceAgent) {
    const agentUsers = await User.where({ referenceAgent: filter.referenceAgent }).fetch()
    
    delete filter.referenceAgent
    
    filter.userId = { $in: agentUsers.rows.map(user => user._id) }
  }
  
  let result = (await this.where(filter)
    // add user data
    .with('user', userQuery => {
      userQuery.setVisible(['_id', 'firstName', 'lastName', 'email', 'contractNumber', 'referenceAgent'])
        // add reference agent data if any
        .with('referenceAgentData', refAgentQuery => {
          refAgentQuery.setVisible(['_id', 'firstName', 'lastName', 'email'])
        })
    })
    .with('targetUser', userQuery => {
      userQuery.setVisible([
        'id',
        'firstName',
        'lastName',
        'email',
        'contractNumber'
      ])
    })
    // .with('files')
    .setVisible(project, null)
    .sort(sort)
    .paginate(requestPagination.page)).toJSON()
  
  // fetch all related attachments
  result.data = await this.loadAttachments(result.data, true)
  
  const end = Date.now()
  
  result.time = end - start
  
  return preparePaginatedResult(result, sort, originalFilter)
}


