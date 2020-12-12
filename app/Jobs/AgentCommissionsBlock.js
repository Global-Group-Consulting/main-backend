/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const agentId = job.attrs.data.id

    const result = await CommissionModel.blockCommissionsToReinvest(agentId)

    job.attrs.result = result.toJSON()

    await job.save()
  }
