'use strict'

/** @typedef {import("../../../@types/Brite/Brite").Brite} Brite */

const {WhitelistValidator} = require("../WhitelistValidator")


class BriteCreate extends WhitelistValidator {
  get includeParams() {
    return true
  }

  /**
   * @returns {Partial<Brite>}
   */
  get rules() {
    return {
      id: "required|objectId",
      amountChange: "required|number",
      movementType: "required|string",
      referenceSemester: "required|string",
    }
  }
}

module.exports = BriteCreate
