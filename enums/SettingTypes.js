const {BasicEnum} = require('../classes/BasicEnum')

const MovementTypes = require("./MovementTypes")

/**
 * @enum
 */
class SettingTypes extends BasicEnum {
  constructor() {
    super('SettingTypes')

    this.GLOBAL = "global"
    this.USER = "user"

    this.data = {
        [this.GLOBAL]: {
        id: 'global',
      },
      [this.USER]: {
        id: 'user',
      }
    }
  }
}

module.exports = new SettingTypes()
