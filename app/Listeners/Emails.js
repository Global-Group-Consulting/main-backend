'use strict'

/** @type {import("../../providers/Queue")} */
const QueueProvider = use("QueueProvider")
const UserModel = use("App/Models/User")
const Env = use("Env")
const Antl = use('Antl')

const NotificationTypes = require("../../enums/NotificationTypes")

const Emails = exports = module.exports = {}

Emails.scheduleNotificationEmail = async (notification) => {
  const user = await UserModel.find(notification.receiverId)
  const notificationSubject = notification.type.startsWith("message") ? notification.payload.subject : ""

  await QueueProvider.schedule(Env.get("NOTIFICATION_EMAIL_TIMEOUT"), "send_email", {
    tmpl: "new_notification",
    data: {
      ...user.toJSON(),
      notification: notification.toJSON(),
      notificationType: `<strong>${Antl.compile('it', 'enums.NotificationTypes.' + notification.type, {})}</strong>
${notificationSubject ? `(${notificationSubject})` : ''}`,
      siteLink: `${Env.get('PUBLIC_URL')}`
    }
  })
}

Emails.cancelNotificationEmail = async (notification) => {
  const jobs = await QueueProvider.agenda.jobs({'data.data.notification.id': notification._id.toString()});

  for (const job of jobs) {
    // remove only the non completed jobs
    if (!job.attrs.completed) {
      await job.remove()
    }
  }
}
