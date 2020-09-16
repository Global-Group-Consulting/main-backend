'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('tokens', (table) => {
     
    })
  }

  down () {
    this.drop('tokens')
  }
}

module.exports = TokensSchema
