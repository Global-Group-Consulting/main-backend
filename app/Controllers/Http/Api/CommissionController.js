'use strict'

/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

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
    return CommissionModel.addExistingDepositCommission()
  }

  /**
   * Commission that occurs yearly, based on the previous clients deposit.
   * This will calculate 6% of the clients deposit and split in in 3 months, april, august, december
   * @returns {Promise<void>}
   */
  async addAnnualCommission() {
    return CommissionModel.addAnnualCommission()
  }
}

module.exports = CommissionController
