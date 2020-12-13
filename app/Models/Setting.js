'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setting extends Model {
  /**
   * @returns {Promise<Object.<string, string>[]>}
   */
  static async fetchList() {
    return this.fetch().rows.reduce((acc, curr) => {
      acc[curr.name] = curr.value
    }, {})
  }
}

module.exports = Setting
