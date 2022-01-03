'use strict';

const QueueProvider = use("QueueProvider");
const User = use("App/Models/User");
const CronUser = use("App/Models/CronUser");
const { validate } = use('Validator');
const CronException = use('App/Exceptions/CronException');

const { HttpException, LogicalException } = require('@adonisjs/generic-exceptions');

class SecretCommandController {
  /**
   * Trigger the agents commissions block
   * @returns {Promise<*>}
   */
  async triggerAllCommissionsBlock () {
    return await QueueProvider.add("trigger_commissions_block_month", {
      attrs: {
        data: {}
      }
    });
  }

  /**
   * Trigger the agents commissions block ONLY for the specified user
   * @param {{id: string}} params
   * @returns {Promise<*>}
   */
  async triggerSingleCommissionsBlock ({ params }) {
    const agentId = params.id;
    const validation = await validate(params, {
      id: "objectId|idExists"
    });

    if (validation.fails()) {
      throw new CronException('Invalid user id.');
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

  /**
   * Trigger all users month recapitalization
   * @returns {Promise<*>}
   */
  async triggerAllRecapitalization () {
    return await QueueProvider.add("trigger_users_recapitalization", {
      attrs: {
        data: {}
      }
    });
  }

  /**
   * Trigger user month recapitalization ONLY for the specified user
   * @param {{id: string}} params
   * @returns {Promise<*>}
   */
  async triggerSingleRecapitalization ({ params }) {
    const userId = params.id;
    const validation = await validate(params, {
      id: "objectId|idExists"
    });

    if (validation.fails()) {
      throw new CronException('Invalid user id.');
    }

    return await QueueProvider.add("user_recapitalization", {
      userId
    });
  }

  /*async initializeUserMovements ({ request }) {
    const data = request.all();

    if (!data.userId) {
      throw new Error("Missing userId");
    }

    const jobResult = await QueueProvider.add("user_initialize_movements", data);

    return jobResult;
  }*/

  /**
   * Create a cron user to be used for authenticate all cron jobs
   * @param request
   * @returns {Promise<Model>}
   */
  async createCronUser ({ request }) {
    const user = request.only(["username", "password"]);

    if (!user.username || !user.password) {
      throw new CronException("Missing username or password", 400);
    }

    const existingUser = await CronUser.where({ username: user.username }).first();

    if (existingUser) {
      throw new CronException("Can't create the required user.", 400);
    }

    return CronUser.create(user);
  }
}

module.exports = SecretCommandController
