const {BasicEnum} = require("../classes/BasicEnum");

class AgentBritesType extends BasicEnum {
  FROM_WITHDRAWL = "from_withdrawl";

  constructor() {
    super('AgentBritesType')

    this.data = {
      [this.FROM_WITHDRAWL]: {
        id: this.FROM_WITHDRAWL,
      }
    }
  }
}

module.exports = new AgentBritesType()
