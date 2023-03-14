'use strict'

/**
 * @typedef {import('../../../../@types/dto/statistics/SystemTotalsInDto').SystemTotalsInDto} SystemTotalsInDto
 * @typedef {import('../../../../@types/dto/statistics/SystemTotalsOutDto').SystemTotalsOutDto} SystemTotalsOutDto
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

/** @type { import('../../../Models/User')} */
const User = use('App/Models/User')

/** @type {typeof import('../../../Models/Movement')} */
const Movement = use('App/Models/Movement')

/** @type {typeof import('../../../Models/Commission')} */
const Commission = use('App/Models/Commission')

/** @type {typeof import('../../../Models/Statistic')} */
const Statistic = use('App/Models/Statistic')

/** @type {import('../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')

const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const StatisticsFiltersMap = require('../../../Filters/StatisticsFilters.map')
const StatisticsFiltersAdminTotalsMap = require('../../../Filters/StatisticsFiltersAdminTotals.map')
const ValidationException = require('../../../Exceptions/ValidationException')
const { AclPermissions } = require('../../../Helpers/Acl/enums/acl.permissions')

class StatisticsController {
  /**
   * Return totals of the movements in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<SystemTotalsInDto>}
   */
  async getSystemTotalsIn ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersAdminTotalsMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return Movement.getAdminTotalsIn(filters)
  }
  
  /**
   * Return totals of the movements in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<SystemTotalsOutDto>}
   */
  async getSystemTotalsOut ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersAdminTotalsMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return Movement.getAdminTotalsOut(filters)
  }
  
  /**
   * Return totals of the commissions in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<CommissionTotalsDto>}
   */
  async getCommissionTotals ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return Commission.getAdminTotals(filters)
  }
  
  /**
   * Return totals of the commissions in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<UserStatusesDto>}
   */
  async getUserStatuses ({ request, auth }) {
    // const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    const filters = {}
    
    await this.handleAgentRequest(filters, auth, '_id')
    
    return User.getUsersStatusTotals(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<NewUsersCountDto>}
   */
  async getNewUsersCount ({ request, auth }) {
    // const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    const filters = {}
    
    await this.handleAgentRequest(filters, auth)
    
    return User.getNewUsersTotals(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<AgentNewUsersCount[]>}
   */
  async getAgentNewUsersCount ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return User.getAgentsNewUsersTotals(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<AgentNewDepositsCountDto[]>}
   */
  async getAgentNewDepositsCount ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return User.getAgentsTotalEarnings(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<RefundReportDto[]>}
   */
  async getRefundReport ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return Movement.getStatisticsRefundReport(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<WithdrawalDepositReportDto[]>}
   */
  async getWithdrawalDepositReport ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return Movement.getWithdrawalDepositReport(filters)
  }
  
  /**
   * Return totals of new users in the system
   *
   * @param {HttpRequest} request
   * @param {Auth} auth
   * @return {Promise<WithdrawalInterestReportDto[]>}
   */
  async getWithdrawalInterestReport ({ request, auth }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersMap)
    
    await this.handleAgentRequest(filters, auth)
    
    return Movement.getWithdrawalInterestReport(filters)
  }
  
  /**
   * Refresh the statistics of a user in the system
   * @return {Promise<any>}
   */
  async movementsRefresh ({ request }) {
    const userId = request.input('userId')
    const dates = request.input('dates').map(dateString => {
      const date = new Date(dateString)
  
      if (date.toString() === 'Invalid Dates field') {
        throw new ValidationException('Invalid date')
      }
  
      return date
    })
  
    return Statistic.refreshMovementStatistics(userId, dates)
  }
  
  /**
   * When receiving a request from an agent, it must filter the results by the agent's users
   *
   * @param {any} filters
   * @param {Auth} auth
   * @param {string} fieldToUse
   * @return {Promise<void>}
   */
  async handleAgentRequest (filters, auth, fieldToUse = 'userId') {
    // if user is agent, must filter by agent id
    if (AclProvider.isAgent(auth) && !filters[fieldToUse]) {
      // get agents direct users
      const userIds = await User.where({ 'referenceAgent': auth.user._id }).select('_id').fetch()
      
      // must get ids of all its users and sub users
      const subUserIds = await User.getTeamUsersIds(auth.user, true, true)
      
      filters[fieldToUse] = { '$in': [...userIds.rows.map(user => user._id), ...subUserIds] }
    }
  }
  
}

module.exports = StatisticsController
