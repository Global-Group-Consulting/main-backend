/** @type {typeof import("../Models/User")} */
const UserModel = use("App/Models/User")
/**
 * Every 16th of each month at 00:10:00 the queue `trigger_users_recapitalization` gets triggered.
 *   - This will add to the queue a job `user_recapitalization` for each user, including agents
 *
 * @returns {Promise<void>}
 */
module.exports =
  /**
   * @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job
   * @param {typeof import("../../providers/Queue")} QueueProvider
   * */
  async function (job, QueueProvider) {
    const userList = await UserModel.getUsersToRecapitalize()
    const addedJobs = []

    console.log("   --- Starting trigger user recapitalization for " + userList.length)

    await Promise.all(
      userList.map(async (user) => {
        const newJob = await QueueProvider.add("user_recapitalization", {userId: user._id.toString()})
        addedJobs.push(newJob.attrs._id.toString())
      })
    )

    job.attrs.result = addedJobs;

    if (job.save) {
      await job.save()
    }

    return job
  }
