'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const Antl = use('Antl')

class LocalizedException extends LogicalException {
  constructor (message, status) {
    super(Antl.str((message), 'exceptions'), status)
  }
}

module.exports.LocalizedException = LocalizedException
