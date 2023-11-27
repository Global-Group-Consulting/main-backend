'use strict'

/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User')

/** @type {import('../../../../providers/Acl/index')} */
const Acl = use('AclProvider')

const AclGenericException = require('../../../Exceptions/Acl/AclGenericException')
const AclForbiddenException = require('../../../Exceptions/Acl/AclForbiddenException')
const RequestException = require('../../../Exceptions/RequestException')

const UserRoles = require('../../../../enums/UserRoles')
const { UsersPermissions } = require('../../../Helpers/Acl/enums/users.permissions')
const { user } = require('../../../Filters/RequestFilters.map')

class SelectOptionController {
  
  sanitizeFilterString (filter) {
    // sanitize string
    let toReturn = filter.replace(/[^\d^\w^\s]|\s{2,}/g, '').trim()
    const groups = toReturn.split(' ')
    
    console.log(toReturn, groups)
    
    groups.forEach((group) => {
      if (group.length < 2) {
        throw new RequestException('Filter text be at least 2 characters long')
      }
    })
    
    return toReturn
  }
  
  /**
   * Return a list of all agents, necessary for the referenceAgent form select
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<*>}
   */
  async getAgentsList ({ request, auth }) {
    const userIsAllowed = await Acl.checkPermissions([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ], auth)
    /** @type {string} */
    let filter = request.input('name')
    
    if (!userIsAllowed) {
      throw new AclForbiddenException()
    }
    
    if (!filter || filter.length < 2) {
      throw new RequestException('Filter must be at least 2 characters long')
    }
    
    filter = this.sanitizeFilterString(filter)
    const query = {
      role: UserRoles.AGENTE,
      $or: [
        { firstName: { $regex: filter.replace(/\s/g, '|'), $options: 'i' } },
        { lastName: { $regex: filter.replace(/\s/g, '|'), $options: 'i' } }
      ]
    }
    
    if (auth.user.isAgent()) {
      const sugAgentIds = await User.getTeamUsersIds(auth.user, true, true)
      
      query['_id'] = {
        $in: sugAgentIds
      }
    }
    
    const toReturn = await User.where(query)
      .setVisible(['_id', 'firstName', 'lastName', 'referenceAgent'])
      .sort({ lastName: 1, firstName: 1 })
      .fetch()
    
    // preparing options to return
    return toReturn.rows.map((user) => {
      return {
        text: user.firstName + ' ' + user.lastName,
        value: user._id,
        rawData: user
      }
    })
  }
  
  /**
   * Return a list of all users, necessary for the users form select
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<*>}
   */
  async getUsersList ({ request, auth }) {
    const userIsAllowed = await Acl.checkPermissions([UsersPermissions.ACL_USERS_ALL_READ, UsersPermissions.ACL_USERS_TEAM_READ], auth)
    /** @type {string} */
    let filter = request.input('name')
    
    if (!userIsAllowed) {
      throw new AclForbiddenException()
    }
    
    // console.log(filter, filter.length)
    
    if (!filter || filter.length < 2) {
      throw new RequestException('Filter must be at least 2 characters long')
    }
    
    // sanitize string
    filter = this.sanitizeFilterString(filter)
    
    const query = {
      role: { $in: [UserRoles.CLIENTE, UserRoles.AGENTE] },
      $or: [
        { firstName: { $regex: filter.replace(/\s/g, '|'), $options: 'i' } },
        { lastName: { $regex: filter.replace(/\s/g, '|'), $options: 'i' } }
      ]
    }
    
    // If user is agent, can only see his team clients
    if (auth.user.isAgent()) {
      const sugAgentIds = await User.getTeamUsersIds(auth.user, true, true)
      
      query['_id'] = {
        $in: sugAgentIds
      }
    }
    
    const toReturn = await User.where(query)
      .setVisible(['_id', 'firstName', 'lastName', 'referenceAgent'])
      .sort({ lastName: 1, firstName: 1 })
      .fetch()
    
    // preparing options to return
    return toReturn.rows.map((user) => {
      return {
        text: user.firstName + ' ' + user.lastName,
        value: user._id,
        rawData: user
      }
    })
  }
}

module
  .exports = SelectOptionController
