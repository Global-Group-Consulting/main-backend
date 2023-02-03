const { BasicEnum } = require('../classes/BasicEnum')

/** @enum */
class CalendarCategoryVisibility extends BasicEnum {
  constructor () {
    super('CalendarCategoryVisibility')
    
    this.ALL = 'all'
    this.ME = 'author'
    this.ADMINS = 'admin'
    this.CUSTOMER_SERVICES = 'clients_service'
    this.AGENTS = 'agent'
  }
}

module.exports = new CalendarCategoryVisibility()
