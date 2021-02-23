/** @typedef {import("../../@types/Movement").IMovement} IMovement */
/** @typedef {import("../../@types/User").User} User */

/** @type {typeof import("../Models/Movement")} */
const MovementModel = use("App/Models/Movement")

/** @type {typeof import("../Models/Brite")} */
const BriteModel = use("App/Models/Brite")

/**
 * @param job
 * @returns {Promise<void>}
 */
module.exports =
  /** @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job */
  async function (job) {
    const movementId = job.attrs.data.movementId

    /**
     * @type {IMovement}
     */
    const movement = await MovementModel.find(movementId)

    if (!movement) {
      throw new Error("Movement not found")
    }

    /**
     * @type {BriteModel & Model}
     */
    const cratedMovement = await BriteModel.recapitalizationAdd({
      amountChange: movement.amountChange,
      userId: movement.userId,
    })

    job.attrs.result = cratedMovement.toJSON()

    await job.save()
  }
