'use strict';

const { validations } = require('indicative/validator');

const { WhitelistValidator } = require("../WhitelistValidator");

class MovementsAdd extends WhitelistValidator {
  get includeFiles () {
    return true;
  }

  /**
   * @returns {import("/@types/News").NewsCreateDto}
   */
  get rules () {
    return {
      title: "required",
      text: "required",
      endAt: [validations.dateFormat(['YYYY-MM-DD HH:mm:ss'])],
      startAt: [validations.dateFormat(['YYYY-MM-DD HH:mm:ss'])],
      newsAttachments: "array"
    };
  }
}

module.exports = MovementsAdd;
