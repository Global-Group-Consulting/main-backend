const {BasicEnum} = require("../classes/BasicEnum");

class AgentTeamType extends BasicEnum {
  constructor() {
    super('AgentTeamType')

    this.GROUP_PERCENTAGE = "group_percentage"
    this.SUBJECT_PERCENTAGE = "subject_percentage"

    this.data = {
      [this.GROUP_PERCENTAGE]: {
        id: "group_percentage",
      },
      [this.SUBJECT_PERCENTAGE]: {
        id: "subject_percentage",
      }
    }
  }
}

module.exports = new AgentTeamType()
