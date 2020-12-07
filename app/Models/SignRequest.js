'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const {castToObjectId} = require("../Helpers/ModelFormatters")

class SignRequest extends Model {

  static async getUser(requestId) {
    const signRequest = this.where("uuid", requestId).with("user").first()

    return signRequest.user;
  }

  user() {
    return this.belongsTo("App/Models/User", "userId", "_id")
  }

  setUserId(value) {
    return castToObjectId(value)
  }
}

module.exports = SignRequest
