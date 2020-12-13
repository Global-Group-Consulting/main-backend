const Agenda = require("agenda");
const mongoUriBuilder = require('mongo-uri-builder');
const {upperFirst, camelCase} = require("lodash");

const Logger = use("Logger")
const Helpers = use('Helpers');

let agendaInstance = null

class Queue {
  /**
   * @param {Adonis.ConfigExt} Config
   */
  constructor(Config) {
    const appMongoConnection = Config.get("database.mongodb")

    Logger.info("-- INITIATING QUEUE PROVIDER --")

    if (!appMongoConnection) {
      throw new Error("Missing MongoDb configuration.")
    }

    if (!appMongoConnection.connectionString) {
      appMongoConnection.connectionString = mongoUriBuilder({
        ...appMongoConnection.connection
      })
    }

    this.Config = Config

    this.queuesList = {}

    if (agendaInstance) {
      /**
       * @private
       */
      this._agenda = agendaInstance

      Logger.info("-- USING EXISTING AGENDA INSTANCE --")

    } else {

      /** @type {Agenda} */
      this._agenda = new Agenda({
        db: {
          address: appMongoConnection.connectionString,
          collection: "queueJobs",
          options: {
            useUnifiedTopology: true
          }
        }
      });

      agendaInstance = this._agenda
      this._start()
    }

  }

  /**
   * @private
   */
  async _start() {
    const queuesList = this.Config.get("queue.queuesList")

    for (const queueName in queuesList) {
      /** @type {QueueProvider.Config} */
      const queue = queuesList[queueName]

      if (!queue) {
        Logger.error("Can't process unnamed queue", queue)

        continue
      }

      const action = queue.action || upperFirst(camelCase(queueName))
      const jobPath = Helpers.appRoot() + `/${this.Config.get('queue.jobsPath')}/${action}`

      try {
        const job = require(jobPath + ".js")

        if (typeof job !== "function") {
          throw new Error("Invalid job type.")
        }

        this._agenda.define(queueName, queue.options || {}, job)

        this.queuesList[queueName] = job
      } catch (er) {
        if (er.code === "MODULE_NOT_FOUND") {
          Logger.error("Can't find the JobHandler for " + queueName + " at " + jobPath)
        } else {
          Logger.error(er)
        }
      }
    }

    this._addEventListeners()

    await this._agenda.start()
  }

  /**
   * @private
   */
  _addEventListeners() {
    this._agenda.on("start", /** @param {QueueProvider.Job} job */job => {
      Logger.info(["Job STARTING", job.attrs.name].join(" - "))
    })

    this._agenda.on("success", /** @param {QueueProvider.Job} job */job => {
      Logger.info(["Job COMPLETED SUCCESSFULLY", job.attrs.name].join(" - "))
    })

    this._agenda.on("fail", /** @param {QueueProvider.Job} job */(err, job) => {
      Logger.info(["Job COMPLETED FAILING", job.attrs.name, err].join(" - "))
    })
  }

  /**
   * @private
   *
   * @param {string | string[]} queueName
   */
  async _checkQueueExistence(queueName) {
    await this._agenda["_ready"]

    for (const jobName of (queueName instanceof Array ? queueName : [queueName]))
      if (!this._agenda["_definitions"][jobName]) {
        throw new Error("Unknown queue " + jobName)
      }
  }

  /**
   * @public
   *
   * @param {QueueProvider.List} queueName
   * @param {{}} [data]
   * @returns {Promise<QueueProvider.Job>}
   */
  async add(queueName, data) {
    await this._checkQueueExistence(queueName)

    return await this._agenda.now(queueName, data);
  }

  /**
   * @public
   *
   * @param {string} when - @see https://github.com/matthewmueller/date#examples
   * @param {QueueProvider.List[] | QueueProvider.List} queueName
   * @param {{}} [data]
   * @returns {Promise<QueueProvider.Job>}
   */
  async schedule(when, queueName, data) {
    await this._checkQueueExistence(queueName)

    // @ts-ignore
    return await this._agenda.schedule(when, queueName, data);
  }

  /**
   * There can be only one job at a time, so if a job is added more than once,
   * each time, this will overwrite the existing one.
   *
   * DEFAULTS: options.skipImmediate = true
   *
   * @public
   *
   * @param {string | number} interval - @see https://github.com/matthewmueller/date#examples
   * @param {QueueProvider.List[] | QueueProvider.List} queueName
   * @param {{}} [data]
   * @param {{skipImmediate: boolean}} [options]
   * @returns {Promise<QueueProvider.Job>}
   */
  async cron(interval, queueName, data, options) {
    await this._checkQueueExistence(queueName)

    // @ts-ignore
    return await this._agenda.every(interval, queueName, data, Object.assign({
      skipImmediate: true,
    }, options));
  }

  async initRecursiveJobs() {
    const recursiveJobs = this.Config.get("queue.recursiveJobs")

    if (!recursiveJobs || recursiveJobs.length === 0) {
      return
    }

    for (const job of recursiveJobs) {
      await this.cron(job.recursion, job.queue)
    }
  }
}

/**
 * @type {Queue}
 */
module.exports = Queue
