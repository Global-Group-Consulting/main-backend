'use strict'

/** @typedef {import("../../@types/Notification.d").INotification} INotification */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Event = use("Event")

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
    const createdNotification = await super.create(newNotification)

    Event.emit("schedule::notificationEmail", createdNotification)

    return createdNotification
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

    Event.emit("cancel::notificationEmail", notification)
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
