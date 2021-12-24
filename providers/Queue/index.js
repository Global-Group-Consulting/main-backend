/** @typedef {import("../../@types/QueueProvider/index.d").QueuesListConfig} QueuesListConfig */
/** @typedef {import("../../@types/QueueProvider/index.d").QueuesList} QueuesList */

const Agenda = require("agenda");
const mongoUriBuilder = require('mongo-uri-builder');
const {upperFirst, camelCase} = require("lodash");

const cronParser = require('cron-parser');

const Logger = use("Logger")
const Helpers = use('Helpers');

class Queue {
  /**
   * @param {Adonis.Config} Config
   */
  constructor(Config) {
    const appMongoConnection = Config.get("database.mongodb")

    this.logInfo("INITIATING QUEUE PROVIDER --")

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
    this.jobsList = {}

    /** @type {Agenda} */
    this._agenda = new Agenda({
      db: {
        address: appMongoConnection.connectionString,
        collection: "queueJobs",
        options: {
          useUnifiedTopology: true,
          // useFindAndModify: false,
          useNewUrlParser: true
        }
      },
      defaultLockLifetime: 5000,
    });

    this._initQueues()

    this.initRecursiveJobs()
      .then(() => {
        this.logInfo("Started recursive jobs")
      })
      .catch(er => {
        this.logError("Can't start recursive jobs", er)
      })
  }

  get agenda() {
    return this._agenda
  }

  logInfo(message, ...attrs) {
    Logger.info("[QueueProvider] " + message, ...attrs)
  }

  logError(message, ...attrs) {
    Logger.error("[QueueProvider] " + message, ...attrs)
  }

  async _isReady() {
    return this._agenda._ready
  }

  /**
   * @private
   */
  _initQueues() {
    this.logInfo("Starting available queues")

    /**
     * @type {{}}
     */
    const queuesList = this.Config.get("queue.queuesList")

    for (const queueName in queuesList) {
      /** @type {QueueProvider.Config} */
      const queue = queuesList[queueName]

      if (!queue) {
        this.logError(`Can't process unknown queue "${queueName}"`)

        continue
      }

      const action = queue.action || upperFirst(camelCase(queueName))
      const jobPath = Helpers.appRoot() + `/${this.Config.get('queue.jobsPath')}/${action}`

      this._agenda.define(queueName, queue.options || {}, async (job) => {
        // Require the job workers only when are required for the first time.
        // This to avoid singleton errors.
        if (!this.jobsList[queueName]) {
          console.log("DEFINED JOB", queueName)

          try {
            this.jobsList[queueName] = require(jobPath + ".js")
          } catch (er) {
            console.log(er)

            if (er.code === "MODULE_NOT_FOUND") {
              this.logError("Can't find the JobHandler for " + queueName + " at " + jobPath)
            } else {
              this.logError(er.message, er)
            }
          }
        }

        return this.jobsList[queueName](job, this)
      })
    }

    this._addEventListeners()

    this._agenda.start()
      .then(() => this.logInfo("Agenda started"))
      .catch((er) => this.logError("Can't start agenda", er))
  }

  /**
   * @private
   */
  _addEventListeners() {
    this._agenda.on("start", /** @param {QueueProvider.Job} job */job => {
      this.logInfo(["Job STARTING", job.attrs.name].join(" - "))
    })

    this._agenda.on("success", async /** @param {QueueProvider.Job} job */(job) => {
      this.logInfo(["Job COMPLETED SUCCESSFULLY", job.attrs.name].join(" - "))

      await this._rescheduleCronJob(job)
    })

    this._agenda.on("fail", /**
     @param err
     @param {QueueProvider.Job} job
     */
    async (err, job) => {
      this.logInfo(["Job COMPLETED FAILING", job.attrs.name, err].join(" - "))

      await this._rescheduleCronJob(job)
    })
  }

  async _rescheduleCronJob(job) {
    job.attrs.completed = true

    await job.save()

    if (job.attrs.recursive) {
      const recursiveJobs = this.Config.get("queue.recursiveJobs")
      const jobConfig = recursiveJobs.find(_job => _job.queue === job.attrs.name)

      await this.cron(jobConfig.recursion, jobConfig.queue, job.attrs.data)
    }
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
   * @param {{createdAt?: any, tmpl: string, data?: any}} [data]
   * @returns {Promise<QueueProvider.Job>}
   */
  async add(queueName, data = {}) {
    await this._checkQueueExistence(queueName)

    data.createdAt = new Date()

    return this._agenda.now(queueName, data);
  }

  /**
   * @public
   *
   * @param {string} when - @see https://github.com/matthewmueller/date#examples
   * @param {QueueProvider.List[] | QueueProvider.List} queueName
   * @param {{createdAt: any}} [data]
   * @returns {Promise<QueueProvider.Job>}
   */
  async schedule(when, queueName, data) {
    await this._checkQueueExistence(queueName)

    data.createdAt = new Date()

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
    if (interval === "null") {
      await this._agenda.cancel({
        name: queueName,
        recursive: true,
        completed: {
          $exists: false
        }
      })

      return {}
    }

    await this._checkQueueExistence(queueName)
    const scheduledDate = cronParser.parseExpression(interval)
    const nextRun = scheduledDate.next().toDate()

    /*
    Due to setTimeout limitation of 32 bit length, that would prevent me to add dates more in the feature of 3 weeks,
    i implemented a hybrid method.

    Each job is added as a regular one, scheduled for its date. This is added only once at a time, and checks if other
    jobs with the same name exists that are not yet completed.

    Once a job completes, it's job handler must read itself to the queue using this same method,
    so that the job can recalculate the next run and re-execute.

    Example:
      await QueueProvider.cron(job.attrs.interval, job.attrs.name, job.attrs.data)
     */

    const existJob = await this._agenda.jobs({
      name: queueName,
      recursive: true,
      /* nextRunAt: {
         $gt: new Date()
       },*/
      completed: {
        $exists: false
      }
    })

    // If already exists one that is not yet completed, updates its data.
    if (existJob && existJob.length > 0) {
      const job = existJob[0]

      await job.touch()

      job.attrs.interval = interval;
      job.attrs.lastModifiedAt = new Date();
      job.attrs.lockedAt = null;

      if (nextRun !== job.attrs.nextRunAt) {
        job.schedule(nextRun)
      }

      await job.save()

      return job
    }

    const newJob = this._agenda.create(queueName, data)

    newJob.attrs.recursive = true;
    newJob.attrs.interval = interval;
    newJob.schedule(nextRun)

    await newJob.save()

    // @ts-ignore
    /*
    const addedJob = await this._agenda.every(interval, queueName, data, Object.assign({
         skipImmediate: false,
       }, options));

    return addedJob
   */
  }

  async initRecursiveJobs() {
    const recursiveJobs = this.Config.get("queue.recursiveJobs")

    if (!recursiveJobs || recursiveJobs.length === 0) {
      return
    }

    await this._isReady()

    await Promise.all(
      recursiveJobs.map(async (job) => {
        await this.cron(job.recursion, job.queue)
      })
    )
  }
}

/**
 * @type {Queue}
 */
module.exports = Queue
