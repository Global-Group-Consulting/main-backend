'use strict'

const {upperFirst, camelCase} = require("lodash")

// const UsersController = use("App/Controllers/Http/Api/UserController")

/** @type {typeof import("../../../Models/Movement")} */
const MovementsModel = use("App/Models/Movement")

/** @type {typeof import("../../../Models/Request")} */
const RequestsModel = use("App/Models/Request")

/** @type {typeof import("../../../Models/User")} */
const UserModel = use("App/Models/User")
/** @type {typeof import("../../../Models/Commission")} */
const CommissionModel = use("App/Models/Commission")

const UserRoles = require("../../../../enums/UserRoles")

class DashboardController {

  async getByRole({auth, response, params}) {
    const reqId = params.id
    let user = auth.user

    if (reqId) {
      user = await UserModel.find(reqId)
    }

    const userRole = +user.role
    const roleData = UserRoles.get(userRole)
    const methodName = upperFirst(camelCase(roleData.id))

    if (typeof this[`getFor${methodName}`] !== "function") {
      return response.badRequest("Role not handled.")
    }

    return this[`getFor${methodName}`](user.toJSON())
  }

  async getForAdmin(user) {
    const pendingRequests = await RequestsModel.getPendingOnes(user.role)
    const adminTotals = await MovementsModel.getAdminTotals();
    const newUsersTotals = await UserModel.getNewUsersTotals();
    const usersStatusTotals = await UserModel.getUsersStatusTotals();

    return {
      pendingRequests,
      totals: adminTotals,
      newUsers: newUsersTotals,
      usersStatus: usersStatusTotals,
      agents: {},
      club: {
        //Statistiche del club con i totali per ogni semestre di tutte le tipologie, uscite, entrate, ecc.
      }
    }
  }

  async getForServClienti(user) {
    const usersToValidate = await UserModel.getUsersToValidate(user.role)

    return {
      usersToValidate
    }
  }

  async getForCliente(user) {
    const currentStatus = await MovementsModel.getLast(user.id)
    const monthMovements = await MovementsModel.getMonthMovements(user.id)
    const pastRecapitalizations = await MovementsModel.getPastRecapitalizations(user.id)

    return {
      blocks: {
        deposit: currentStatus ? currentStatus.deposit : 0, //user.contractInitialInvestment,
        interestAmount: currentStatus ? currentStatus.interestAmount : 0,
        depositCollected: monthMovements.depositCollected,
        interestsCollected: monthMovements.interestsCollected
      },
      charts: {
        pastRecapitalizations
      }
    }
  }

  async getForAgente(user) {
    const currentStatus = await MovementsModel.getLast(user.id)
    const monthMovements = await MovementsModel.getMonthMovements(user.id)
    const pastRecapitalizations = await MovementsModel.getPastRecapitalizations(user.id)

    return {
      blocks: {
        deposit: currentStatus ? currentStatus.deposit : 0, //user.contractInitialInvestment,
        interestAmount: currentStatus ? currentStatus.interestAmount : 0,
        depositCollected: monthMovements.depositCollected,
        interestsCollected: monthMovements.interestsCollected,
      },
      charts: {
        pastRecapitalizations
      }
    }
  }
}

module.exports = DashboardController
