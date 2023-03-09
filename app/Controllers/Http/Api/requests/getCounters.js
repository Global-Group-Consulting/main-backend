/** @type {import('../../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')

const User = use('App/Models/User')

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
  
  // If user is agent and no userId is provided, then we need to get all requests for his team
  if (authUser.isAgent() && !match['userId']) {
    const subUserIds = await User.getTeamUsersIds(auth.user, true, true)
    const userIds = await User.getClientsList(auth.user._id, [], true)
    
    match['userId'] = { $in: [...subUserIds, ...userIds] }
  } else if (!authUser.isAdmin() && !authUser.isAgent()) {
    match['userId'] = authUser._id
  }
  
  return RequestModel.getCounters(match)
}
