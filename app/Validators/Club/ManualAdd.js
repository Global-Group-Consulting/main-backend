'use strict'

/** @typedef {import("../../../@types/Brite/Brite").Brite} Brite */

const {WhitelistValidator} = require("../WhitelistValidator")


class BriteManualAdd extends WhitelistValidator {
  get includeParams() {
    return true
  }

  /**
   * @returns {import("../../../@types/Brite/dto/brite.manualAdd").BriteManualAdd}
   */
  get rules() {
    return {
      id: "required|objectId",
      amountChange: "required|number",
      notes: "required|string",
      semester: "required|string",
    }
  }
}

module.exports = BriteManualAdd
