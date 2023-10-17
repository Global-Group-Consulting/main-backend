'use strict'

const { upperFirst, camelCase } = require('lodash')

// const UsersController = use("App/Controllers/Http/Api/UserController")

/** @type {typeof import('../../../Models/Movement')} */
const MovementsModel = use('App/Models/Movement')

/** @type {typeof import('../../../Models/Request')} */
const RequestsModel = use('App/Models/Request')

/** @type {typeof import('../../../Models/User')} */
const UserModel = use('App/Models/User')
/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

const UserRoles = require('../../../../enums/UserRoles')
const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const StatisticsFilters = require('../../../Filters/StatisticsFilters.map')
const { statisticsRefundReport } = require('../../../Models/Movement/statisticsRefundReport')
const {castToObjectId} = require("../../../Helpers/ModelFormatters");

class DashboardController {

  async getByRole ({ auth, response, params, request }) {
    const reqId = params.id
    const onlyStatistics = request.all().onlyStatistics === 'true'
    let user = auth.user

    if (reqId) {
      user = await UserModel.find(reqId)
    }

    const userRole = +user.role
    const roleData = UserRoles.get(userRole)
    const methodName = upperFirst(camelCase(roleData.id))

    if (typeof this[`getFor${methodName}`] !== 'function') {
      return response.badRequest('Role not handled.')
    }

    return this[`getFor${methodName}`](user.toJSON(), onlyStatistics)
  }

  async getForAdmin (user, onlyStatistics) {
    const toReturn = {}

    if (!onlyStatistics) {
      toReturn.pendingRequests = await RequestsModel.getPendingOnes(user.role)
    } else {
      toReturn.systemTotals = await MovementsModel.getAdminTotals()
      toReturn.commissionTotals = await CommissionModel.getAdminTotals()
      toReturn.usersStatus = await UserModel.getUsersStatusTotals()
      toReturn.newUsers = await UserModel.getNewUsersTotals()
      toReturn.agentsNewUsers = await UserModel.getAgentsNewUsersTotals()
      toReturn.agentsTotalEarnings = await UserModel.getAgentsTotalEarnings()
    }

    return toReturn
  }

  async getForServClienti (user, onlyStatistics) {
    const toReturn = {}

    if (onlyStatistics) {
      toReturn.systemTotals = await MovementsModel.getAdminTotals()
      toReturn.commissionTotals = await CommissionModel.getAdminTotals()
      toReturn.usersStatus = await UserModel.getUsersStatusTotals()
      toReturn.newUsers = await UserModel.getNewUsersTotals()
      toReturn.agentsNewUsers = await UserModel.getAgentsNewUsersTotals()
      toReturn.agentsTotalEarnings = await UserModel.getAgentsTotalEarnings()
    }

    return toReturn
  }

  async getForCliente (user) {
    const currentStatus = await MovementsModel.getLast(user.id)
    const monthMovements = await MovementsModel.getMonthMovements(user.id)
    const pastRecapitalizations = await MovementsModel.getPastRecapitalizations(user.id)
    const refundStatistics = await MovementsModel.getStatisticsRefundReport(prepareFiltersQuery({ userId: user.id }, StatisticsFilters))

    let clubRepayment = refundStatistics.length > 0 ? refundStatistics[0].totals.filter(item => item.fromClub) : []

    return {
      blocks: {
        deposit: currentStatus ? currentStatus.deposit : 0, //user.contractInitialInvestment,
        depositRaw: await this.depositWithoutPendingMovements((currentStatus ? currentStatus.deposit : 0), user.id),
        interestAmount: currentStatus ? currentStatus.interestAmount : 0,
        depositCollected: monthMovements.depositCollected,
        interestsCollected: monthMovements.interestsCollected,
        clubRepayment: clubRepayment.length ? clubRepayment[0].total : 0
      },
      charts: {
        pastRecapitalizations
      }
    }
  }

  async getForAgente (user) {
    const currentStatus = await MovementsModel.getLast(user.id)
    const monthMovements = await MovementsModel.getMonthMovements(user.id)
    const pastRecapitalizations = await MovementsModel.getPastRecapitalizations(user.id)
    const refundStatistics = await MovementsModel.getStatisticsRefundReport(prepareFiltersQuery({ userId: user.id }, StatisticsFilters))

    let clubRepayment = refundStatistics.length > 0 ? refundStatistics[0].totals.filter(item => item.fromClub) : []

    return {
      blocks: {
        deposit: currentStatus ? currentStatus.deposit : 0, //user.contractInitialInvestment,
        depositRaw: await this.depositWithoutPendingMovements((currentStatus ? currentStatus.deposit : 0), user.id),
        interestAmount: currentStatus ? currentStatus.interestAmount : 0,
        depositCollected: monthMovements.depositCollected,
        interestsCollected: monthMovements.interestsCollected,
        clubRepayment: clubRepayment.length ? clubRepayment[0].total : 0
      },
      charts: {
        pastRecapitalizations
      }
    }
  }

  async depositWithoutPendingMovements (deposit, userId) {
    const pendingMovements = await MovementsModel.where({userId: castToObjectId(userId), approved: false}).fetch();

    let pendingDeposit = pendingMovements.rows.reduce((acc, curr) => {
      return acc + curr.amountChange;
    }, 0);

    return deposit + pendingDeposit;
  }
}

module.exports = DashboardController
