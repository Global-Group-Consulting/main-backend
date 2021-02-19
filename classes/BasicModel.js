/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

module.exports = class BasicModel extends Model {
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
}
