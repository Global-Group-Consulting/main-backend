'use strict'

/**
 * @typedef {import('../../../../@types/dto/statistics/SystemTotalsDto').SystemTotalsDto} SystemTotalsDto
 * @typedef {import('../../../../@types/dto/statistics/CommissionTotalsDto').CommissionTotalsDto} CommissionTotalsDto
 * @typedef {import('../../../../@types/dto/statistics/UserStatusesDto').UserStatusesDto} UserStatusesDto
 * @typedef {import('../../../../@types/dto/statistics/NewUsersCountDto').NewUsersCountDto} NewUsersCountDto
 * @typedef {import('../../../../@types/dto/statistics/AgentNewUsersCount').AgentNewUsersCount} AgentNewUsersCount
 * @typedef {import('../../../../@types/dto/statistics/AgentNewDepositsCountDto').AgentNewDepositsCountDto} AgentNewDepositsCountDto
 * @typedef {import('../../../../@types/dto/statistics/RefundReportDto').RefundReportDto} RefundReportDto
 * @typedef {import('../../../../@types/dto/statistics/WithdrawalDepositReportDto').WithdrawalDepositReportDto} WithdrawalDepositReportDto
 * @typedef {import('../../../../@types/dto/statistics/WithdrawalInterestReportDto').WithdrawalInterestReportDto} WithdrawalInterestReportDto
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
   * Return totals of the movements in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<SystemTotalsDto>}
   */
  async getSystemTotals ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Movement.getAdminTotals(filters)
  }
  
  /**
   * Return totals of the commissions in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<CommissionTotalsDto>}
   */
  async getCommissionTotals ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Commission.getAdminTotals(filters)
  }
  
  /**
   * Return totals of the commissions in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<UserStatusesDto>}
   */
  async getUserStatuses ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return User.getUsersStatusTotals(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<NewUsersCountDto>}
   */
  async getNewUsersCount ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return User.getNewUsersTotals(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<AgentNewUsersCount[]>}
   */
  async getAgentNewUsersCount ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return User.getAgentsNewUsersTotals(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<AgentNewDepositsCountDto[]>}
   */
  async getAgentNewDepositsCount ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return User.getAgentsTotalEarnings(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<RefundReportDto[]>}
   */
  async getRefundReport ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Movement.getStatisticsRefundReport(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<WithdrawalDepositReportDto[]>}
   */
  async getWithdrawalDepositReport ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Movement.getWithdrawalDepositReport(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<WithdrawalInterestReportDto[]>}
   */
  async getWithdrawalInterestReport ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    return Movement.getWithdrawalInterestReport(filters)
  }
  
}

module.exports = StatisticsController
