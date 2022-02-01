/** @typedef {import("../../@types/Movement").IMovement} IMovement */
/** @typedef {import("../../@types/User").User} User */

/** @type {typeof import("../Models/Movement")} */
const MovementModel = use("App/Models/Movement")

/** @type {typeof import("../Models/User")} */
const UserModel = use("App/Models/User")

const MovementTypes = require("../../enums/MovementTypes")
const UserRoles = require("../../enums/UserRoles")

/**
 * Calculate and create the movement for the recapitalization of the user
 *
 * Once this gets completed, if the user has a referenceAgent, add the job `commissions_on_total_deposit`, which will
 * calculate the commissions for the agent based on the user's new deposit.
 *
 * If the user is an agent, trigger `agent_commissions_reinvest` which will reinvest the commissions of the previous
 * month
 *
 * @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job
 * @param {typeof import("../../providers/Queue")} QueueProvider
 * @returns {Promise<void>}
 */
module.exports =
  async function (job, QueueProvider) {
    const userId = job.attrs.data.userId
    /**
     * @type {User}
     */
    const user = await UserModel.find(userId)

    if (!user) {
      throw new Error("User not found")
    }

    /**
     * @type {IMovement}
     */
    const newMovement = {
      userId,
      movementType: MovementTypes.INTEREST_RECAPITALIZED,
      interestPercentage: +user.contractPercentage
    }
  
    /**
     * @type {IMovement & Document}
     */
    const cratedMovement = await MovementModel.create(newMovement)
    job.attrs.result = cratedMovement.toJSON()
  
    await job.save()
  
    await QueueProvider.create("brite_recapitalize", {
      amountChange: cratedMovement.amountChange,
      userId: cratedMovement.userId
    })
  
    // Avoid adding this job if the percentage of the user is equal or higher to 4, because the agent would get anything
    if (user.referenceAgent && cratedMovement && cratedMovement.interestPercentage < 4) {
      await QueueProvider.add("agent_commissions_on_total_deposit", {
        movementId: job.attrs.result._id,
        agentId: user.referenceAgent
      })
    }
  
    if (user.role === UserRoles.AGENTE) {
      await QueueProvider.add("agent_commissions_reinvest", {userId: user._id.toString()})
    }
  }
