const { prepareSorting, preparePaginatedResult } = require('../../Utilities/Pagination')
const { AggregationBuilder } = require('../../../classes/AggregationBuilder')
const { omit } = require('lodash')

/**
 * @param {any} filter
 * @param {any} project
 * @param {import('/@types/HttpRequest').RequestPagination} requestPagination
 * @return {Promise<PaginatedResult>}
 */
module.exports.filter = async function (filter = {}, project, requestPagination) {
  let sort = prepareSorting(requestPagination /*{ 'created_at': -1, 'updated_at': -1, 'completed_at': -1 }*/)
  
  // Aggregation executed only when is required a referenceAgent as a filter
  // otherwise the query is executed with the lucid-mongo because it's faster
  if (filter.referenceAgent) {
    const refAgent = filter.referenceAgent
    
    const aggregation = await this.createAggregation('users')
    
    return aggregation.$match({ referenceAgent: refAgent })
      .$project({
        '_id': 1,
        'firstName': 1,
        'lastName': 1,
        'email': 1,
        'contractNumber': 1,
        'referenceAgent': 1
      })
      .$lookupOne('users', 'referenceAgent', '_id', 'referenceAgentData', {
        '_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1
      })
      .$lookup('requests', '_id', 'userId', 'requests')
      .$unwind('requests', false)
      .$$pushRaw([
        {
          '$addFields': {
            'requests.user': '$$ROOT'
          }
        }, {
          '$project': {
            'requests.user.requests': 0
          }
        }, {
          '$replaceWith': '$requests'
        }
      ])
      .$sort(sort)
      .$match(omit(filter, 'referenceAgent'))
      .$lookupOne('users', 'targetUserId', '_id', 'targetUser', {
        '_id': 1,
        'firstName': 1,
        'lastName': 1,
        'email': 1,
        'contractNumber': 1
      })
      .$project(project)
      .paginate(requestPagination)
  }
  
  const start = Date.now()
  
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
    .setVisible(project, null)
    .sort(sort)
    .paginate(requestPagination.page)).toJSON()
  const end = Date.now()
  
  result.time = end - start
  
  return preparePaginatedResult(result, sort, filter)
}


