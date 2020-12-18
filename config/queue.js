const Env = use("Env")

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
    user_recapitalization: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    agent_commissions_on_new_deposit: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    agent_commissions_on_total_deposit: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    agent_commissions_block: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    agent_commissions_reinvest: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },

    trigger_commissions_block_month: {},
    trigger_users_recapitalization: {}
  },
  recursiveJobs: [
    {
      queue: "trigger_commissions_block_month",
      recursion: "* 10 0 1 * *"
      // recursion: "*/10 * * * * *"
    },
    {
      queue: "trigger_users_recapitalization",
      recursion: Env.get("TRIGGER_RECAPITALIZATION", "* 10 0 16 * *")
    }
  ]
}

module.exports = queueConfig
