'use strict'

const {Command} = require('@adonisjs/ace')

class JobRunner extends Command {
  static get signature() {
    return `
      job-runner
      { --job-name=@value : Specify the job name  }
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

    const jobResult = await QueueProvider.queuesList[jobName]({
      attrs: {
        data: {}
      }
    })

    console.log(jobResult)

    // process.exit()
  }
}

module.exports = JobRunner
