/** @type {typeof import('../Models/Commission')} */
const CommissionModel = use('App/Models/Commission')

/** @type {typeof import('../Models/User')} */
const UserModel = use('App/Models/User')
const Database = use('Database')

const {castToObjectId} = require("../Helpers/ModelFormatters")

module.exports =
  /** @param {import("../../@types/QueueProvider").QueueJob} job */
  async function (job) {
    const db = await Database.connect("mongodb")

    /**
     * @type {{oldAgent: string, newAgent: string}}
     */
    const data = job.attrs.data
    const result = await db.collection('users').updateMany(
      {'referenceAgent': castToObjectId(data.oldAgent)}, //search
      [{"$set": {'referenceAgent': castToObjectId(data.newAgent)}}], // new data
      {} // options
    )


    /* const result = await UserModel.query()*/
    /*   .where('referenceAgent', castToObjectId(data.oldAgent))*/
    /*   .update({'referenceAgent': castToObjectId(data.newAgent)})*/

    job.attrs.result = 'ok';

    await job.save()
  }
