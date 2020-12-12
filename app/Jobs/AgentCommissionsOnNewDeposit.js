/** @type {typeof import('../../../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const data = job.attrs.data

    const result = await CommissionModel.addNewDepositCommission(data.movementId)

    job.attrs.result = result.toJSON()

    await job.save()
  }
