const { BasicEnum } = require('../classes/BasicEnum')


class PersonTypes extends BasicEnum {
  /**
   * @enum
   */
  constructor() {
    super("PersonTypes")

    this.FISICA = 1
    this.GIURIDICA = 2

    this.data = {
      [this.FISICA]: {
        id: 'fisica',
        text: 'Persona Fisica'
      },
      [this.GIURIDICA]: {
        id: 'giuridica',
        text: 'Persona Giuridica'
      },
    }
  }
}

module.exports = new PersonTypes()
