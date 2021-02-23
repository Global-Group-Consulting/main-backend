/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const {castToObjectId, castToNumber} = require("../app/Helpers/ModelFormatters.js")


class BasicModel extends Model {
  static get hidden() {
    return ['_id', '__v']
  }

  static get computed() {
    return ["id"]
  }

  getId(value) {
    try {
      return this._id.toString()
    } catch (er) {
      return value
    }
  }

  setRequestId(value) {
    return castToObjectId(value)
  }

  setMovementId(value) {
    return castToObjectId(value)
  }

  setUserId(value) {
    return castToObjectId(value)
  }
}


module.exports = BasicModel
