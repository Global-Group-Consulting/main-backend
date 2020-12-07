const MovementModel = use("App/Models/Movement")
const UserModel = use("App/Models/User")

const MovementTypes = require("../../enums/MovementTypes")

module.exports =
  /** @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job */
  async function (job) {
    /**
     * @type {{userId: string}}
     */
    const incomingData = job.attrs.data
    const userId = incomingData.userId
    const user = await UserModel.find(userId)
    const lastMovement = await MovementModel.getLast(userId)

    if (!user) {
      throw new Error("User not found")
    }

    if (!lastMovement) {
      try {
        const result = await MovementModel.create({
          userId: user,
          movementType: MovementTypes.INITIAL_DEPOSIT,
          amountChange: +user.contractInitialInvestment,
          interestPercentage: +user.contractPercentage
        })

        job.attrs.result = result.toJSON()
      } catch (er) {
        throw new Error("Can't create initial deposit movement. " + er.message)
      }
    } else {
      job.attrs.result = "Initial movement already existing"
    }

    await job.save()
  }
