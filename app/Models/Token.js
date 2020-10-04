'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async (token) => {
      if (!token.hasOwnProperty('is_revoked')) {
        token.is_revoked = false
      }
    })
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Token
