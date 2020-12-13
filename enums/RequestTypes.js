const {BasicEnum} = require('../classes/BasicEnum')

const MovementTypes = require("./MovementTypes")

/**
 * @enum
 */
class RequestTypes extends BasicEnum {
  constructor() {
    super('RequestTypes')

    // this.ADMIN = 1
    this.VERSAMENTO = 2
    this.RISC_CAPITALE = 3
    this.RISC_INTERESSI = 4

    /**  Riscossione delle provvigioni dell'agente */
    this.RISC_PROVVIGIONI = 5

    this.data = {
      /*  [this.ADMIN]: {
          id: 'admin',
          text: 'Admin'
        },*/
      [this.VERSAMENTO]: {
        id: 'versamento',
        text: 'Versamento',
        movement: MovementTypes.DEPOSIT_ADDED
      },
      [this.RISC_CAPITALE]: {
        id: 'risc_capitale',
        text: 'Riscossione capitale',
        movement: MovementTypes.DEPOSIT_COLLECTED
      },
      [this.RISC_INTERESSI]: {
        id: 'risc_interessi',
        text: 'Riscossione interessi',
        movement: MovementTypes.INTEREST_COLLECTED
      },
      // interessi maturati mensilmente
      [this.RISC_PROVVIGIONI]: {
        id: 'risc_provvigioni',
        movement: MovementTypes.COMMISSION_COLLECTED
      }
    }
  }
}

module.exports = new RequestTypes()
