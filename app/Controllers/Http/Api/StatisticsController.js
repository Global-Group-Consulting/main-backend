'use strict'

/**
 * @typedef {import('../../../../@types/dto/statistics/SystemTotalsDto').SystemTotalsDto} SystemTotalsDto
 * @typedef {import('../../../../@types/dto/statistics/CommissionTotalsDto').CommissionTotalsDto} CommissionTotalsDto
 *
 * @typedef {import('../../../../@types/HttpRequest').HttpRequest} HttpRequest
 */

/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User')

/** @type {typeof import('../../../Models/Movement')} */
const Movement = use('App/Models/Movement')

/** @type {typeof import('../../../Models/Commission')} */
const Commission = use('App/Models/Commission')

/** @type {import('../../../../providers/Acl/index')} */
const Acl = use('AclProvider')

const AclGenericException = require('../../../Exceptions/Acl/AclGenericException')
const AclForbiddenException = require('../../../Exceptions/Acl/AclForbiddenException')
const RequestException = require('../../../Exceptions/RequestException')

const UserRoles = require('../../../../enums/UserRoles')
const { UsersPermissions } = require('../../../Helpers/Acl/enums/users.permissions')
const { user } = require('../../../Filters/RequestFilters.map')
const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const StatisticsFiltersMap = require('../../../Filters/StatisticsFilters.map')

class StatisticsController {
  /**
   *
   * @param {HttpRequest} request
   * @return {Promise<SystemTotalsDto>}
   */
  async getSystemTotals ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Movement.getAdminTotals(filters)
  }
  
  /**
   *
   * @param {HttpRequest} request
   * @return {Promise<CommissionTotalsDto>}
   */
  async getCommissionTotals ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Commission.getAdminTotals(filters)
  }
  
}

module.exports = StatisticsController
