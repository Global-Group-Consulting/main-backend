'use strict';

const QueueProvider = use("QueueProvider");
const User = use("App/Models/User");

class SecretCommandController {
  async triggerCommissionsBlock () {
    const jobResult = await QueueProvider.add("trigger_commissions_block_month", {
      attrs: {
        data: {}
      }
    });

    return jobResult;
  }

  async triggerCommissionsBlockForAgent ({ params }) {
    const agentId = params.id;

    if (!agentId) {
      throw new Error("Missing userId");
    }

    /** @type {Model<User>} */
    const agent = await User.find(agentId);

    let newJob;

    /*
        I first must check if the user has the autoWithdrawl active.
        If so, i add to the que an "agent_commissions_auto_withdrawl" job and once this is completed will be added
        the agent_commissions_block.
      */
    if (agent.autoWithdrawlAll) {
      newJob = await QueueProvider.add("agent_commissions_auto_withdrawl", {
        id: agent._id.toString(),
        autoWithdrawlAll: agent.autoWithdrawlAll,
        autoWithdrawlAllRecursively: agent.autoWithdrawlAllRecursively
      });
    } else {
      newJob = await QueueProvider.add("agent_commissions_block", { id: agentId });
    }

    return newJob;
  }

  async triggerUsersRecapitalization () {
    try {
      const jobResult = await QueueProvider.add("trigger_users_recapitalization", {
        attrs: {
          data: {}
        }
      });

      return jobResult;
    } catch (er) {
      console.log(er);
    }
  }

  async initializeUserMovements({request}) {
    const data = request.all();

    if (!data.userId) {
      throw new Error("Missing userId");
    }

    const jobResult = await QueueProvider.add("user_initialize_movements", data);

    return jobResult;
  }

  async recapitalizeUser ({ params }) {
    const userId = params.id;

    if (!userId) {
      throw new Error("Missing userId");
    }

    return await QueueProvider.add("user_recapitalization", {
      userId
    });
  }
}

module.exports = SecretCommandController
