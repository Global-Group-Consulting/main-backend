'use strict'

const QueueProvider = use("QueueProvider")

class SecretCommandController {
  async triggerCommissionsBlock() {
    const jobResult = await QueueProvider.add("trigger_commissions_block_month", {
      attrs: {
        data: {}
      }
    })

    return jobResult
  }

  async triggerUsersRecapitalization() {
    try {
      const jobResult = await QueueProvider.add("trigger_users_recapitalization", {
        attrs: {
          data: {}
        }
      })

      return jobResult
    } catch (er) {
      console.log(er)
    }
  }

  async initializeUserMovements({request}) {
    const data = request.all()

    if (!data.userId) {
      throw new Error("Missing userId")
    }

    const jobResult = await QueueProvider.add("user_initialize_movements", data)

    return jobResult
  }

  async recapitalizeUser({request}) {
    const data = request.all()

    if (!data.userId) {
      throw new Error("Missing userId")
    }

    const jobResult = await QueueProvider.add("user_recapitalization", {userId: data.userId})

    return jobResult
  }
}

module.exports = SecretCommandController
