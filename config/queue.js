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
        concurrency: 15,
        lockLimit: 5,
      }
    },
    user_recapitalization_brites: {
      options: {
        concurrency: 15,
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
    agent_commissions_auto_withdrawl: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },

    transfer_agent_commissions: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },
    transfer_agent_clients: {
      options: {
        concurrency: 5,
        lockLimit: 5
      }
    },

    trigger_commissions_block_month: {},
    trigger_users_recapitalization: {},
    trigger_periodic_emails: {},

  },
  /*
  // removes recursive jobs due to switching to external service
  recursiveJobs: [
    {
      queue: "trigger_commissions_block_month",
      recursion: Env.get("TRIGGER_COMMISSION_BLOCK", "1 10 0 1 * *")
    },
    {
      queue: "trigger_users_recapitalization",
      recursion: Env.get("TRIGGER_RECAPITALIZATION", "1 10 0 16 * *")
    },
    {
      queue: "trigger_periodic_emails",
      recursion: Env.get("TRIGGER_PERIODIC_EMAILS", "1 10 6 16 * *")
    }
  ]*/
}

module.exports = queueConfig
