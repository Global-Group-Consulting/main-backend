/** @type {typeof import("../Models/User")} */
const UserModel = use("App/Models/User")

/**
 * Each 1st of the month, the remaining commissions for an agent,
 * must be blocked and reset, so that the agent can restart accumulating new commissions.
 *
 * Once blocked, this commissions will be later (16th of each month) processed and reinvested
 * @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job
 * @param {typeof import("../../providers/Queue")} QueueProvider
 * @returns {Promise<void>}
 */
module.exports =
  async function (job, QueueProvider) {
    const agentsList = await UserModel.getAgentsForCommissionsBlock()
    const addedJobs = []

    console.log("   --- Starting trigger Agents Commission block for " + agentsList.length)

    for (const agent of agentsList) {
      let newJob

      /*
        I first must check if the user has the autoWithdrawl active.
        If so, i add to the que an "agent_commissions_auto_withdrawl" job and once this is completed will be added
        the agent_commissions_block.
      */
      if (agent.autoWithdrawlAll) {
        newJob = await QueueProvider.add("agent_commissions_auto_withdrawl", {
          id: agent._id.toString(),
          autoWithdrawlAll: agent.autoWithdrawlAll,
          autoWithdrawlAllRecursively: agent.autoWithdrawlAllRecursively
        })
      } else {
        newJob = await QueueProvider.add("agent_commissions_block", {id: agent._id.toString()})
      }

      addedJobs.push(newJob.toJSON()._id)
    }

    job.attrs.result = addedJobs;

    if (job.save) {
      await job.save()
    }

    return job
  }
