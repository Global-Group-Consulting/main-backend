/** @type {import("../../providers/EmailSender")} */
const EmailSender = use('EmailSender')


module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const payload = job.attrs.data

    const result = await EmailSender.send(payload.tmpl, payload.data)

    job.attrs.result = result

    await job.save()

    /*if (method) {
      const result = await EmailSender[method](payload.data)

      return Promise.resolve(result)
    }*/
  }
