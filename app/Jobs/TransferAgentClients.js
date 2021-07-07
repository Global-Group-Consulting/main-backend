/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

/** @type {typeof import('../Models/User')} */
const UserModel = use('App/Models/User')

const {castToObjectId} = require("../Helpers/ModelFormatters")

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    /**
     * @type {{oldAgent: string, newAgent: string}}
     */
    const data = job.attrs.data

    const result = await UserModel.query()
      .where('referenceAgent', castToObjectId(data.oldAgent))
      .update({'referenceAgent': castToObjectId(data.newAgent)})

    job.attrs.result = "toJson" in result ? result.toJSON() : result;

    await job.save()
  }
