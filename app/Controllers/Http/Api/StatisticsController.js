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

/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User')

/** @type {typeof import('../../../Models/Movement')} */
const Movement = use('App/Models/Movement')

/** @type {typeof import('../../../Models/Commission')} */
const Commission = use('App/Models/Commission')

/** @type {typeof import('../../../Models/Statistic')} */
const Statistic = use('App/Models/Statistic')

const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const StatisticsFiltersMap = require('../../../Filters/StatisticsFilters.map')
const StatisticsFiltersAdminTotalsMap = require('../../../Filters/StatisticsFiltersAdminTotals.map')
const ValidationException = require('../../../Exceptions/ValidationException')

class StatisticsController {
  /**
   * Return totals of the movements in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<SystemTotalsInDto>}
   */
  async getSystemTotalsIn ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersAdminTotalsMap)
    
    return Movement.getAdminTotalsIn(filters)
  }
  
  /**
   * Return totals of the movements in the system
   *
   * @param {HttpRequest} request
   * @return {Promise<SystemTotalsOutDto>}
   */
  async getSystemTotalsOut ({ request }) {
    const filters = prepareFiltersQuery(request.pagination.filters, StatisticsFiltersAdminTotalsMap)
    
    return Movement.getAdminTotalsOut(filters)
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
  
}

module.exports = StatisticsController
