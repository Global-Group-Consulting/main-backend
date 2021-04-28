/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

/** @type {typeof import("../../providers/Queue")} */
const QueueProvider = use("QueueProvider")

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const {
      id,
      autoWithdrawlAll,
      autoWithdrawlAllRecursively
    } = job.attrs.data;

    const result = await CommissionModel.autoWithdrawlAll(id, autoWithdrawlAll, autoWithdrawlAllRecursively)

    job.attrs.result = result.toJSON()

    await job.save()

    // Once the autoWithdrawl has completed, add the job for "agent_commissions_block"
    await QueueProvider.add("agent_commissions_block", {id})
  }
