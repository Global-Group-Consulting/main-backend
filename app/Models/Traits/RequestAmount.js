'use strict'
/** @typedef {typeof import("../Request")} IRequest */

/**
 * @type {import("../../../@types/SettingsProvider").SettingsProvider}
 */
const SettingsProvider = use("SettingsProvider")

const CurrencyType = require("../../../enums/CurrencyType")
const RequestTypes = require("../../../enums/RequestTypes")

class RequestAmount {
  register(Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)

    Model.calcRightAmount = this.calcRightAmount;
  }

  /**
   * @param {IRequest} data
   */
  calcRightAmount(data) {
    const settingsLimit = SettingsProvider.get("requestMinAmount");
    const settingsPercentage = SettingsProvider.get("requestBritePercentage");

    if (+data.type === RequestTypes.RISC_PROVVIGIONI
      && settingsLimit !== null && settingsPercentage !== null
      && (!data.autoWithdrawlAll || data.autoWithdrawlAllRevoked)) {

      data.amountOriginal = data.amount;

      /*
       If the amount is bigger than the limit, must calculate only a percentage to convert to brite,
       otherwise convert all to brites.
       */
      if (data.amount > settingsLimit) {
        const briteAmount = data.amount * settingsPercentage / 100;

        data.amountBrite = briteAmount * 2;
        data.amountEuro = data.amount - briteAmount;
        data.briteConversionPercentage = settingsPercentage
      } else {
        data.amountBrite = data.amount * 2;
        data.briteConversionPercentage = 100
        data.currency = CurrencyType.BRITE
      }
    }
  }
}

module.exports = RequestAmount
