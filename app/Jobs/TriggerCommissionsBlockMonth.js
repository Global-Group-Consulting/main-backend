/** @type {typeof import("../Models/User")} */
const UserModel = use("App/Models/User")

/** @type {typeof import("../../providers/Queue")} */
const QueueProvider = use("QueueProvider")

/**
 * Each 1st of the month, the remaining commissions for an agent,
 * must be blocked and reset, so that the agent can restart accumulating new commissions.
 *
 * Once blocked, this commissions will be later (16th of each month) processed and reinvested
 *
 * @param job
 * @returns {Promise<void>}
 */
module.exports =
  /** @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job */
  async function (job) {
    const agentsList = await UserModel.getAgents()
    const addedJobs = []

    for (const agent of agentsList.rows) {
      const newJob = await QueueProvider.add("agent_commissions_block", {id: agent._id.toString()})
      addedJobs.push(newJob.toJSON()._id)
    }

    job.attrs.result = addedJobs;

    if (job.save) {
      await job.save()
    }

    return job
  }
