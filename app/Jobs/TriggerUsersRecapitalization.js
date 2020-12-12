/** @type {typeof import("../Models/User")} */
const UserModel = use("App/Models/User")

/** @type {typeof import("../../providers/Queue")} */
const QueueProvider = use("QueueProvider")

/**
 * Every 16th of each month at 00:10:00 the queue `trigger_users_recapitalization` gets triggered.
 *   - This will add to the queue a job `user_recapitalization` for each user, including agents
 *
 * @param job
 * @returns {Promise<void>}
 */
module.exports =
  /** @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job */
  async function (job) {
    const userList = await UserModel.getUsersToRecapitalize()
    const addedJobs = []

    for (const user of userList.rows) {
      addedJobs.push(await QueueProvider.add("user_recapitalization", {userId: user._id.toString()}))
    }

    job.attrs.result = addedJobs;

    if (job.save) {
      await job.save()
    }
  }
