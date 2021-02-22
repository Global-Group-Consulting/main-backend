'use strict'

/** @type {import('../../classes/BasicModel')} */
const BasicModel = require('../../classes/BasicModel')

class AclPermissionsModel extends BasicModel {

  setCode(value) {
    return value ? value.toLowerCase().replace(/\s/g, "_") : value
  }
}

module.exports = AclPermissionsModel

