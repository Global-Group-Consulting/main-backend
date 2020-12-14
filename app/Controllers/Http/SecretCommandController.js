'use strict'

const QueueProvider = use("QueueProvider")

class SecretCommandController {
  async triggerCommissionsBlock() {
    const jobResult = await QueueProvider.queuesList["trigger_commissions_block_month"]({
      attrs: {
        data: {}
      }
    })

    return jobResult
  }

  async triggerUsersRecapitalization() {
    const jobResult = await QueueProvider.queuesList["trigger_users_recapitalization"]({
      attrs: {
        data: {}
      }
    })

    return jobResult
  }

  async initializeUserMovements({request}) {
    const data = request.all()

    if (!data.userId) {
      throw new Error("Missing userId")
    }

    const jobResult = await QueueProvider.queuesList["user_initialize_movements"]({
      attrs: {
        data: data
      }
    })

    return jobResult
  }
}

module.exports = SecretCommandController
