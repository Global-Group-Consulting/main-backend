const { BasicEnum } = require('../classes/BasicEnum')

class NotificationPlatformType extends BasicEnum {
  /**
   * @enum
   */
  constructor () {
    super('NotificationPlatformType')
    
    // Capitale dell'utente
    this.PUSH = 'push'
    this.EMAIL = 'email'
    this.APP = 'app'
  }
}

/**
 * @export {{test: string}}
 */
module.exports = new NotificationPlatformType()
