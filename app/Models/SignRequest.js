'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const {castToObjectId} = require("../Helpers/ModelFormatters")

class SignRequest extends Model {

  static async getUser(requestId) {
    const signRequest = await this.where("uuid", requestId).with("user").first()

    return signRequest.user;
  }

  static async getRequestUuid(userId) {
    const signRequest = await this.where({
      "userId": castToObjectId(userId),
      "hooks.event_type": {$nin: ["declined"]}
    }).sort({_id: -1})
      .first()

    return signRequest;
  }

  user() {
    return this.belongsTo("App/Models/User", "userId", "_id")
  }

  setUserId(value) {
    return castToObjectId(value)
  }
}

module.exports = SignRequest
