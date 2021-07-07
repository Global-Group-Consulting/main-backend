/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

const CommissionType = require("../../enums/CommissionType")

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    /**
     * @type {{oldAgent: string, newAgent: string}}
     */
    const data = job.attrs.data

    const oldAgentPortfolio = await CommissionModel._getLastCommission(data.oldAgent)

    let result;

    if (!data.newAgent) {
      result = await CommissionModel.manualWithdrawal({
        userId: data.oldAgent,
        amountChange: oldAgentPortfolio.currMonthCommissions,
        notes: "Azzeramento a seguito di cambio tipologia account."
      });
    } else {
      result = await CommissionModel.manualAdd({
        userId: data.newAgent,
        referenceAgent: data.oldAgent,
        refAgentAvailableAmount: oldAgentPortfolio.currMonthCommissions,
        amountChange: oldAgentPortfolio.currMonthCommissions || 0,
        commissionType: CommissionType.MANUAL_TRANSFER,
        notes: "Trasferimento a seguito di rimozione di un altro agente",
      })

    }
    job.attrs.result = result.toJSON()

    await job.save()
  }
