'use strict'

/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

const UserRoles = require("../../../../enums/UserRoles")

class CommissionController {
  async read() {
    return CommissionModel.fetchAll()
  }

  /**
   * Commission that occurs each time a client of an agent invest new money
   * @returns {Promise<void>}
   */
  async addNewDepositCommission() {
    const movementId = "5fc56e27cb9b9012e64b7689"

    return CommissionModel.addNewDepositCommission(movementId)
  }

  /**
   * Commission that'll be calculated based on clients last month deposit after recapitalizazion occurs.
   * @returns {Promise<void>}
   */
  async addExistingDepositCommission() {
    const movementId = "5fba3ec52a2eb021bba1059c"

    return CommissionModel.addExistingDepositCommission(movementId)
  }

  /**
   * Commission that occurs yearly, based on the previous clients deposit.
   * This will calculate 6% of the clients deposit and split in in 3 months, april, august, december
   * @returns {Promise<void>}
   */
  async addAnnualCommission() {
    return CommissionModel.addAnnualCommission()
  }

  async reinvestCommissions() {
    return CommissionModel.reinvestCommissions("5fb13bb31466c51e1d036f3c")
  }

  async collectCommissions() {
    return CommissionModel.collectCommissions("5fb13bb31466c51e1d036f3c", 100)
  }


  async getStatus({params, auth}) {
    const userRole = auth.user.role
    let userId = auth.user._id

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole)) {
      userId = params["id"]
    }

    const result = await CommissionModel.getLast(userId)
    const list = await CommissionModel.getAll(userId)

    return {
      blocks: {
        monthTotalCommissions: 0,
        agentTotalCommissions: 0,
        monthCollectedCommissions: 0,
        agentTotalReinvestedCommissions: 0
      },
      list
    }
  }
}

module.exports = CommissionController
