'use strict';

const { validations } = require('indicative/validator');

const { WhitelistValidator } = require("../WhitelistValidator");

class MovementsAdd extends WhitelistValidator {
  get includeFiles () {
    return true;
  }

  /**
   * @returns {import("/@types/News").NewsUpdateDto}
   */
  get rules () {
    return {
      title: "required",
      text: "required",
      endAt: [validations.dateFormat(['YYYY-MM-DD'])],
      startAt: [validations.dateFormat(['YYYY-MM-DD'])],
      newsAttachments: "array"
    };
  }
}

module.exports = MovementsAdd;
