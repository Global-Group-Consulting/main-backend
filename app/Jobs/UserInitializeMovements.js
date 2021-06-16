const MovementModel = use("App/Models/Movement")
const RequestModel = use("App/Models/Request")
const UserModel = use("App/Models/User")
const Event = use("Event")

const RequestTypes = require("../../enums/RequestTypes")
const WalletTypes = require("../../enums/WalletTypes")
const CurrencyType = require("../../enums/CurrencyType")
const MovementTypes = require("../../enums/MovementTypes")

module.exports =
  /** @param {import("../../@types/QueueProvider/QueueJob.d").QueueJob} job */
  async function (job) {
    /**
     * @type {{userId: string}}
     */
    const incomingData = job.attrs.data
    const userId = incomingData.userId
    /** @type {import("../../@types/User").User} */
    const user = await UserModel.find(userId)
    const lastMovement = await MovementModel.getLast(userId)

    if (!user) {
      throw new Error("User not found")
    }

    if(lastMovement){
      throw new Error("Initial movement already exists")
    }

    try {
      /*
      If the user cont5ract has been imported, generates the initial movement and avoid generating any agent commission,
      because this is an already existing user.
       */
      if (user.contractImported || user.contractInitialInvestment === 0) {
        const result = await MovementModel.create({
          userId: user,
          movementType: MovementTypes.INITIAL_DEPOSIT,
          amountChange: +user.contractInitialInvestment,
          interestPercentage: +user.contractPercentage,
          notes: "Versamento iniziale",
        })

        job.attrs.result = result.toJSON()

        /* if (incomingData.calcAgentCommissions) {
              Event.emit("movements::initial", job.attrs.result)
            }
        */
      } else {
        const newRequest = await RequestModel.create({
          amount: user.contractInitialInvestment,
          userId: user._id,
          type: RequestTypes.VERSAMENTO,
          wallet: WalletTypes.DEPOSIT,
          currency: CurrencyType.EURO,
          clubCardNumber: user.clubCardNumber,
          notes: "Versamento iniziale",
          initialMovement: true
        })

        job.attrs.result = newRequest.toJSON()
      }

    } catch (e) {
      throw new Error("Can't create initial deposit movement. " + e.message)
    }

    /*if (!lastMovement) {
      try {
        const result = await MovementModel.create({
          userId: user,
          movementType: MovementTypes.INITIAL_DEPOSIT,
          amountChange: +user.contractInitialInvestment,
          interestPercentage: +user.contractPercentage
        })

        job.attrs.result = result.toJSON()

        if (incomingData.calcAgentCommissions) {
          Event.emit("movements::initial", job.attrs.result)
        }

      } catch (er) {
        throw new Error("Can't create initial deposit movement. " + er.message)
      }
    } else {
      job.attrs.result = "Initial movement already existing"
    }*/

    if (job.save) {
      await job.save()
    }
  }
