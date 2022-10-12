const Logger = use("Logger")
const {LaravelQueue} = require("./LaravelQueue");

class QueueProvider {
  queue;
  logger;
  
  constructor(config) {
    this.queue = new LaravelQueue(config);
    this.logger = Logger
  }
  
  /**
   *
   * @param {{userId: string, amountEuro: float, amount: integer}} payload
   * @returns {*}
   */
  dispatchBriteRecapitalization(payload) {
    return this.queue.pushTo("TriggerBriteRecapitalization", payload);
  }
  
}

/**
 * @type {QueueProvider}
 */
module.exports = QueueProvider
