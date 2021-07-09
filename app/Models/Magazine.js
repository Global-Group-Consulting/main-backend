'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require("moment")

class Magazine extends Model {
  incomingDateFormat = "YYYY-MM-DD";

  static get computed() {
    return ['id']
  }

  static get hidden() {
    return ["_id"]
  }

  coverFile() {
    return this.hasOne("App/Models/File", "coverFileId", "_id")
  }

  getId({_id}) {
    return _id.toString()
  }

  setPublicationDate(value) {
    return moment(value, this.incomingDateFormat).toDate()
  }

  setShowFrom(value) {
    return moment(value, this.incomingDateFormat).toDate()
  }

  setShowUntil(value) {
    return moment(value, this.incomingDateFormat).toDate()
  }
}

module.exports = Magazine
