'use strict'

/** @typedef {import("../../../@types/Brite/Brite").Brite} Brite */

const {WhitelistValidator} = require("../WhitelistValidator")


class BriteUpdate extends WhitelistValidator {
  /**
   * @returns {Brite}
   */
  get rules() {
    return {}
  }
}

module.exports = BriteUpdate
