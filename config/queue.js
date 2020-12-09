/**
 * @type {import("../@types/QueueProvider").QueueFileConfig}
 */
const queueConfig = {
  jobsPath: "app/Jobs",
  queuesList: {
    send_email: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    user_initialize_movements: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    agent_new_deposit_commission: {
      options: {
        concurrency: 1,
        lockLimit: 5
      }
    }
  }
}

module.exports = queueConfig
