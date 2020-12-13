/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const agentId = job.attrs.data.userId

    const result = await CommissionModel.reinvestCommissions(agentId)

    job.attrs.result = result.toJSON()

    await job.save()
  }
