/** @type {import('../../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')

/** @type { import('../../../../Models/Request').Request} */
const RequestModel = use('App/Models/Request')

const { UsersPermissions } = require('../../../../Helpers/Acl/enums/users.permissions')
const { RequestsPermissions } = require('../../../../Helpers/Acl/enums/requests.permissions')
const AclGenericException = require('../../../../Exceptions/Acl/AclGenericException')
const RequestFiltersMap = require('../../../../Filters/RequestFilters.map')
const { prepareFiltersQuery } = require('../../../../Filters/PrepareFiltersQuery')

/**
 * @param {HttpRequest} request
 * @param {Auth} auth
 *
 * @this {RequestController}
 *
 * @return {Promise<GetCountersDto[]>}
 */
module.exports.getCounters = async function ({ request, auth }) {
  /** @type {User} **/
  const authUser = auth.user
  
  if (!(await AclProvider.checkPermissions([RequestsPermissions.ACL_REQUESTS_ALL_READ, RequestsPermissions.ACL_REQUESTS_SELF_READ], auth))) {
    throw new AclGenericException()
  }
  
  const match = prepareFiltersQuery(request.pagination.filters || {}, RequestFiltersMap)
  
  if (!authUser.isAdmin()) {
    match['userId'] = authUser._id
  }
  
  return RequestModel.getCounters(match)
}
