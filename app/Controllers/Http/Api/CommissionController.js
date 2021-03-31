'use strict'

/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

/** @type {typeof import("../../../Models/Request")} */
const RequestModel = use("App/Models/Request")

const AclProvider = use('AclProvider')
const Event = use("Event")

const UserRoles = require("../../../../enums/UserRoles")
const RequestTypes = require("../../../../enums/RequestTypes")
const WalletTypes = require("../../../../enums/WalletTypes")
const CurrencyType = require("../../../../enums/CurrencyType")

const {CommissionsPermissions} = require("../../../Helpers/Acl/enums/commissions.permissions");

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

  /**
   * Once the month ends, the commissions must be reinvested and reset, but the real investment must
   * wait the 16th of the month.
   * So first we create a blockCommission movement and reset the commissions.
   * Thi movement will later be used to know what amount bust be reinvested.
   *
   * @returns {Promise<void>}
   */
  async blockCommissionsToReinvest() {
    return CommissionModel.blockCommissionsToReinvest("5fb13bb31466c51e1d036f3c")
  }

  /**
   * Search for the last COMMISSION_TO_REINVEST movement and add the amount of that movement
   * to the user's deposit, by generating a deposit movement.
   *
   * @returns {Promise<*>}
   */
  async reinvestCommissions() {
    return CommissionModel.reinvestCommissions("5fb13bb31466c51e1d036f3c")
  }

  /**
   * The user decides to collect a part of the current available commissions.
   *
   * @returns {Promise<*>}
   */
  async collectCommissions() {
    return CommissionModel.collectCommissions("5fb13bb31466c51e1d036f3c", 100)
  }

  async getStatus({params, auth}) {
    const userRole = auth.user.role
    let userId = auth.user._id

    let hasSubAgents = false

    if(auth.user.role === UserRoles.AGENTE){
      hasSubAgents = (await auth.user.subAgents().fetch()).rows.length > 0
    }

    if (([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userRole) || hasSubAgents) && params["id"]) {
      userId = params["id"]
    }

    /*
      Must return:
        - current month commissions
        - Reinvested commissions from the last block movement
        - Collected Commissions in the last month
        - Total amount of users new deposit for the last year
     */

    const result = await CommissionModel.getStatistics(userId)
    const list = await CommissionModel.getAll(userId)

    return {
      blocks: result,
      list
    }
  }

  async manualAdd({request, params, auth}) {
    const userId = params.id
    const currentUser = auth.user._id
    const data = request.all()


    /*
    If the user has commissions.all:add permission, doesn't require to be approved
    else if has commissions.team:add must be approved by an admin
     */
    if (await AclProvider.checkPermissions([CommissionsPermissions.COMMISSIONS_ALL_ADD], auth)) {
      return CommissionModel.manualAdd({
        amountChange: data.amountChange,
        notes: data.notes,
        userId,
        created_by: currentUser
      });
    } else {
      const newRequest = await RequestModel.create({
        amount: data.amountChange,
        userId: currentUser,
        targetUserId: userId,
        type: RequestTypes.COMMISSION_MANUAL_ADD,
        wallet: WalletTypes.COMMISION,
        currency: CurrencyType.EURO,
        notes: data.notes
      })

      Event.emit("request::new", newRequest)

      return newRequest
    }
  }
}

module.exports = CommissionController
