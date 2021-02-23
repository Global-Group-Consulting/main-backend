'use strict'

/** @type {typeof import("../../Models/User")} */
const UserModel = use("App/Models/User")

class AccountController {
  constructor({socket, request, auth}) {
    this.socket = socket
    this.request = request

    this.user = auth.user
    this.socket.user = this.user
  }


  async onSetAsRead(notificationId) {

  }
}

module.exports = AccountController
