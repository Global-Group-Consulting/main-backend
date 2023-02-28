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
  
  /**
   *
   * @param {{title: string, content: string, app: string, type: string, platforms: array, receivers: [], action: {text:string, link: string}}} payload
   * @returns {*}
   */
  dispatchCreateNotification(payload) {
    return this.queue.pushTo("CreateNotification", {
      ...payload,
      app: "main",
      type: "calendarUpdate"
    });
  }
}

/**
 * @type {QueueProvider}
 */
module.exports = QueueProvider
