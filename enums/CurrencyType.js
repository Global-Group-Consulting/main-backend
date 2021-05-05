const {BasicEnum} = require('../classes/BasicEnum')

class CurrencyType extends BasicEnum {
  constructor() {
    super('CurrencyType')

    this.EURO = 1
    this.BRITE = 2
    this.GOLD = 3

    this.data = {
      [this.EURO]: {
        id: 'euro',
        symbol: '€'
      },
      [this.BRITE]: {
        id: 'brite',
        symbol: 'Br\''
      },
      [this.GOLD]: {
        id: 'gold',
        symbol: 'Au'
      },
    }
  }
}

module.exports = new CurrencyType()
