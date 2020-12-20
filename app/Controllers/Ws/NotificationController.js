'use strict'

/** @type {typeof import("../../Models/Notification")} */
const NotificationsModel = use("App/Models/Notification")


class NotificationController {
  constructor({socket, request, auth}) {
    this.socket = socket
    this.request = request

    this.user = auth.user
    this.socket.user = this.user

    this._getUnreadNotifications()

  }

  async _getUnreadNotifications() {
    const data = await NotificationsModel.getUnread(this.user._id)

    this.socket.emit("unreadMessages", data)
  }

  onMessage(message) {
    console.log(message)
    // this.socket.broadcastToAll('message', message)
  }

  async onSetAsRead(notificationId) {
    await NotificationsModel.setAsRead(notificationId)

    this.socket.emit("setAsRead", {id: notificationId})
  }
}

module.exports = NotificationController
