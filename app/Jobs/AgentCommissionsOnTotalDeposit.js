/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const movementId = job.attrs.data.movementId

    const result = await CommissionModel.addExistingDepositCommission(movementId)

    job.attrs.result = result.toJSON()

    await job.save()
  }
