'use strict'

const Database = use('Database')


class RawDbConnection {
  register(Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)

    Model.db = null;

    Database.connect('mongodb')
      .then(resp => {
        Model.db = resp
      })
  }
}

module.exports = RawDbConnection
