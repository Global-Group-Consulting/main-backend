'use strict'

/** @typedef {import("../../@types/Notification.d").INotification} INotification */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const {castToObjectId} = require("../Helpers/ModelFormatters")

class Notification extends Model {
  static get computed() {
    return ["id"]
  }

  /**
   * @param {INotification} newNotification
   * @returns {Promise<Model>}
   */
  static async create(newNotification) {
    return super.create(newNotification)
  }

  static async getUnread(userId) {
    return this.where({
      "receiverId": castToObjectId(userId),
      "readOn": {$exists: false}
    })
      .sort({created_at: -1})
      .fetch()
  }

  static async setAsRead(notificationId) {
    const notification = await this.find(notificationId)

    notification.readOn = new Date()

    await notification.save()
  }

  getId() {
    return this._id.toString()
  }

  setSenderId(value) {
    return castToObjectId(value)
  }

  setReceiverId(value) {
    return castToObjectId(value)
  }
}

module.exports = Notification
