const {BasicEnum} = require("../classes/BasicEnum");

class AgentBritesType extends BasicEnum {
  FROM_WITHDRAWL = "from_withdrawl";
  MANUAL_ADD = "manual_add";
  MANUAL_REMOVE = "manual_remove";

  constructor() {
    super('AgentBritesType')

    this.data = {
      [this.FROM_WITHDRAWL]: {
        id: this.FROM_WITHDRAWL,
      },
      [this.MANUAL_ADD]: {
        id: this.MANUAL_ADD,
      },
      [this.MANUAL_REMOVE]: {
        id: this.MANUAL_REMOVE,
      }
    }
  }
}

module.exports = new AgentBritesType()
