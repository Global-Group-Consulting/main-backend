'use strict'

const {upperFirst, camelCase} = require("lodash")

// const UsersController = use("App/Controllers/Http/Api/UserController")

/** @type {typeof import("../../../Models/Movement")} */
const MovementsModel = use("App/Models/Movement")

/** @type {typeof import("../../../Models/Request")} */
const RequestsModel = use("App/Models/Request")

/** @type {typeof import("../../../Models/User")} */
const UserModel = use("App/Models/User")

const UserRoles = require("../../../../enums/UserRoles")

class DashboardController {

  async getByRole({auth, response}) {
    const userRole = +auth.user.role
    const roleData = UserRoles.get(userRole)
    const methodName = upperFirst(camelCase(roleData.id))

    if (typeof this[`getFor${methodName}`] !== "function") {
      return response.badRequest("Role not handled.")
    }

    const data = this[`getFor${methodName}`](auth.user.toJSON())

    return data
  }

  async getForAdmin(user) {
    const pendingRequests = await RequestsModel.getPendingOnes(user.role)

    return {
      pendingRequests
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
        deposit: currentStatus.deposit,
        interestAmount: currentStatus.interestAmount,
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
        deposit: currentStatus.deposit,
        interestAmount: currentStatus.interestAmount,
        depositCollected: monthMovements.depositCollected,
        interestsCollected: monthMovements.interestsCollected
      },
      charts: {
        pastRecapitalizations
      }
    }
  }
}

module.exports = DashboardController
