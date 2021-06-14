/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

/**
 *
 * @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job
 * @param {typeof import("../../providers/Queue")} QueueProvider
 * @returns {Promise<void>}
 */
module.exports =
  async function (job, QueueProvider) {
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
