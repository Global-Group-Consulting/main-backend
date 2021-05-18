/** @typedef {import("../../@types/QueueProvider/index.d").QueuesListConfig} QueuesListConfig */
/** @typedef {import("../../@types/QueueProvider/index.d").QueuesList} QueuesList */
/** @typedef {import("../../@types/QueueProvider/index.d").QueueConfig} QueueConfig */

const {upperFirst, camelCase} = require("lodash");

const cronParser = require('cron-parser');
const IORedis = require("ioredis")
const {Queue: BullQueue, Worker: BullWorker, Job: BullJob} = require("bullmq")


let agendaInstance = null

class Queue {
  /**
   * @param {Adonis.Config} Config
   * @param {Adonis.Logger} Logger
   * @param {Adonis.Helpers} Helpers
   */
  constructor(Config, Logger, Helpers) {
    console.log("-- Constructor called")

    this.redisConnection = new IORedis({
      port: 6379, // Redis port
      host: "127.0.0.1", // Redis host
      //family: 4, // 4 (IPv4) or 6 (IPv6)
      //password: "auth",
      db: 0,
    });

    /**
     * @type {Adonis.Config}
     */
    this.config = Config

    this.logger = Logger
    this.helpers = Helpers

    /**
     * @type {Record<QueuesList, QueueConfig> | {}}
     */
    this.queuesList = {}

    this.workersList = {}


    // = new BullQueue("foo", {connection: this.redisConnection});

    /*const worker = new BullWorker("foo",
      /!**
       * @param {import("bullmq").Job} job
       * @returns {Promise<void>}
       *!/
      async job => {
        console.log(job.data);
      });
*/
    // this.addJobs();
    this._initQueues()
  }

  async addJobs() {
    await this.myQueue.add('myJobName', {foo: 'bar'});
    await this.myQueue.add('myJobName', {qux: 'baz'});
  }

  get agenda() {
    return this._agenda
  }

  _initQueues() {
    /**
     * @type {Record<QueuesList, QueueConfig>}
     */
    const queuesList = this.config.get("queue.queuesList")

    for (const queueName in queuesList) {
      if (!queuesList.hasOwnProperty(queueName)) {
        this.logger.error("Can't process the current queue", queueName)

        continue
      }

      /**
       * @type {QueueConfig}
       */
      const queue = queuesList[queueName]


      try {


        // Store the new Queue
        this.queuesList[queueName] = new BullQueue(queueName, {connection: this.redisConnection});

        // Store the worker for the new Queue. This store is not necessary but could be usefull in the future.
        this.workersList[queueName] = new BullWorker(queueName, (job) => {
          const action = queue.action || upperFirst(camelCase(queueName))
          const jobPath = this.helpers.appRoot() + `/${this.config.get('queue.jobsPath')}/${action}`
          // Tries to import the job worker file
          const jobWorker = require(jobPath + ".js")

          // If the jobWorker is not a function trhow an error
          if (typeof jobWorker !== "function") {
            this.logger.error("Invalid job worker. This should be a function.", {jobPath})
          }

          return jobWorker(job)

        }, queue.options || {})
      } catch (er) {
        console.log(er)

        if (er.code === "MODULE_NOT_FOUND") {
          this.logger.error("Can't find the JobHandler for " + queueName + " at " + jobPath)
        } else {
          this.logger.error(er)
        }
      }
    }
  }


  async _isReady() {
    return this._agenda._ready
  }

  /**
   * @private
   */
  async _start() {
    /**
     * @type {{}}
     */
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
        console.log(er)

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

    this._agenda.on("success", async /** @param {QueueProvider.Job} job */(job) => {
      Logger.info(["Job COMPLETED SUCCESSFULLY", job.attrs.name].join(" - "))

      await this._rescheduleCronJob(job)
    })

    this._agenda.on("fail", /**
     @param err
     @param {QueueProvider.Job} job
     */
    async (err, job) => {
      Logger.info(["Job COMPLETED FAILING", job.attrs.name, err].join(" - "))

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
  async add(queueName, data) {
    await this._checkQueueExistence(queueName)

    data.createdAt = new Date()

    return await this._agenda.now(queueName, data);
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
