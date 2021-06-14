/** @typedef {import("../../@types/QueueProvider/QueueJob").QueueJob} Job */


const PeriodicEmailsModel = use("App/Models/PeriodicEmails")
const UserModel = use("App/Models/User")
const Env = use("Env")

// https://github.com/matthewmueller/date#examples
// const dateJs = require("date.js")

// https://github.com/harrisiirak/cron-parser
const cronParser = require('cron-parser');
const moment = require('moment');

const UserRoles = require('../../enums/UserRoles');

/**
 *
 * @param {PeriodicEmail} email
 * @returns {boolean}
 */
function checkIfJobMustRun(email) {
  const lastRun = email.lastRun ? moment(email.lastRun, true) : null
  const nowDate = moment()

  let toReturn = false

  /*
  If the day when the job should run is <= to the current day, i must check if the job must run
   */
  if (email.dayOfMonth <= nowDate.date()) {

    /*
    If it doesn't exist a lastRun, means that the job must run
     */
    if (lastRun) {

      /*
      If exists a lastRun and the month is passed, means the job must run
       */
      if (lastRun.month() < nowDate.month()) {
        // must run the job
        toReturn = true
      }
    } else {
      // must run the job
      toReturn = true
    }
  }

  return toReturn
}

/**
 * @param {number[]} receiversRoles - List of UserRoles
 */
async function getReceiversList(receiversRoles) {
  const users = await UserModel.where({role: {$in: receiversRoles}})
    .setVisible(["firstName", "lastName", "email", "role"])
    .fetch()

  return users.toJSON()
}

/**
 * @param {Job} job
 * @param {typeof import("../../providers/Queue")} QueueProvider
 */
module.exports = async function (job, QueueProvider) {
  /**
   *
   * @type {{rows: import("../../@types/QueueProvider/PeriodicEmail").PeriodicEmail[]}}
   */
  const periodicEmails = await PeriodicEmailsModel.all()

  await Promise.all(
    periodicEmails.rows.map(async email => {
      if (!checkIfJobMustRun(email)) {
        return
      }

      const receivers = await getReceiversList(email.receivers);

      await Promise.all(receivers.map(async (receiver) => {
        await QueueProvider.add("send_email", {
          tmpl: email.tmpl,
          data: {
            ...(email.data ? email.data : {}),
            ...receiver,
            month: moment().locale("it").format("MMMM"),
            siteLink: Env.get('PUBLIC_URL') + "/requests"
          }
        })
      }))

      email.lastRun = new Date()

      await email.save()
    })
  )

}

