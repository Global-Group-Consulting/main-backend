'use strict'
/** @typedef {typeof import('../Request')} IRequest */

/**
 * @type {import('../../../@types/SettingsProvider').SettingsProvider}
 */
const SettingsProvider = use('SettingsProvider')

const CurrencyType = require('../../../enums/CurrencyType')
const RequestTypes = require('../../../enums/RequestTypes')

class RequestAmount {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)
    
    Model.calcRightAmount = this.calcRightAmount
    Model.calcAgentBriteAmount = this.calcAgentBriteAmount
  }
  
  /**
   * @param {IRequest} data
   */
  calcRightAmount (data) {
    const settingsLimit = SettingsProvider.get('requestMinAmount')
    const settingsPercentage = SettingsProvider.get('requestBritePercentage')
    
    if (+data.type === RequestTypes.RISC_PROVVIGIONI
      && settingsLimit !== null && settingsPercentage !== null
      && (!data.autoWithdrawlAll || data.autoWithdrawlAllRevoked)) {
      
      data.amountOriginal = data.amount
      
      /*
       If the amount is bigger than the limit, must calculate only a percentage to convert to brite,
       otherwise convert all to brites.
       */
      if (data.amount > settingsLimit) {
        const briteAmount = data.amount * settingsPercentage / 100
        
        data.amountBrite = briteAmount * 2
        data.amountEuro = data.amount - briteAmount
        data.briteConversionPercentage = settingsPercentage
      } else {
        data.amountBrite = data.amount * 2
        data.briteConversionPercentage = 100
        data.currency = CurrencyType.BRITE
      }
    }
  }
  
  /**
   * Function that calculates the amount of brites to be converted
   *
   * @param {number} amount
   * @return {{amountBrite: number, amountEuro: number, briteConversionPercentage: number, currency: number}}
   */
  calcAgentBriteAmount (amount) {
    const settingsLimit = SettingsProvider.get('requestMinAmount')
    const settingsPercentage = SettingsProvider.get('requestBritePercentage')
    const toReturn = {
      amountBrite: 0,
      amountEuro: 0,
      briteConversionPercentage: 0,
      currency: CurrencyType.EURO
    }
    
    /*
     If the amount is bigger than the limit, must calculate only a percentage to convert to brite,
     otherwise convert all to brites.
     */
    if (amount > settingsLimit) {
      const briteAmount = amount * settingsPercentage / 100
      
      toReturn.amountBrite = briteAmount * 2
      toReturn.amountEuro = amount - briteAmount
      toReturn.briteConversionPercentage = settingsPercentage
    } else {
      toReturn.amountBrite = amount * 2
      toReturn.briteConversionPercentage = 100
      toReturn.currency = CurrencyType.BRITE
    }
    
    return toReturn
  }
}

module.exports = RequestAmount
