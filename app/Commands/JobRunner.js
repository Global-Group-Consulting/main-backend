'use strict'

const {Command} = require('@adonisjs/ace')

class JobRunner extends Command {
  static get signature() {
    return `
      job-runner
      { --job-name=@value : Specify the job name  }
      { --job-data=@value : Specify the job data as json  }
    `
  }

  static get description() {
    return 'Command for manually executing specific jobs, usually used for development purposes.'
  }

  async handle(args, flags) {
    const jobName = flags.jobName

    if (!jobName) {
      throw new Error("Missing job name")
    }

    const QueueProvider = use("QueueProvider")
    const availableQueues = QueueProvider.Config.get("queue.queuesList")

    if (!Object.keys(availableQueues).includes(jobName)) {
      throw new Error("Unknown job")
    }

    const jobData = flags.jobData ? JSON.parse(flags.jobData) : {}

    const jobResult = await QueueProvider.add(jobName, jobData)

    // process.exit()
  }
}

module.exports = JobRunner
