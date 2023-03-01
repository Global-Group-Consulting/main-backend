const Logger = use('Logger')
const Env = use('Env')
const { LaravelQueue } = require('./LaravelQueue')
const moment = require('moment')

class QueueProvider {
  queue
  logger
  
  constructor (config) {
    this.queue = new LaravelQueue(config)
    this.logger = Logger
  }
  
  ping () {
    return 'ok'
  }
  
  /**
   *
   * @param {{userId: string, amountEuro: float, amount: integer}} payload
   * @returns {*}
   */
  dispatchBriteRecapitalization (payload) {
    return this.queue.pushTo('TriggerBriteRecapitalization', payload)
  }
  
  /**
   *
   * @param {{title: string, content: string, app: string, type: string, platforms: array, receivers: [], action: {text:string, link: string}}} payload
   * @returns {*}
   */
  dispatchCreateNotification(payload) {
    return this.queue.pushTo("CreateNotification", {
      // Add extra data here so that we can override the default values with the payload
      extraData: {
        subject: payload.title,
        title: payload.title,
        content: payload.content
      },
      ...payload,
      app: 'main',
      type: 'calendarUpdate'
    });
  }
  
  /**
   *
   * @param {User} user
   * @param {any[]} events
   * @return {*}
   */
  dispatchAgentDailyCalendarReport (user, events) {
    return this.queue.pushTo('SendEmail', {
      'to': user.email,
      'from': 'info@globalgroup.consulting',
      'subject': 'Eventi in programma per oggi',
      'alias': 'main-calendar-report',
      'templateData': {
        'subject': 'Eventi in programma per oggi',
        'content': 'Ecco gli eventi in programma per oggi:',
        receiver: user,
        events,
        action: {
          text: 'Visualizza eventi',
          link: Env.get('APP_URL') + '/calendar?date=' + moment().format('YYYY-MM-DD')
        }
      }
    })
  }
  
  /**
   *
   * @param {User} user
   * @param {any[]} events
   * @param {boolean} morning
   * @param {any} filters - filters to apply to the calendar so that the user can see the events
   * @return {*}
   */
  dispatchAdminDailyCalendarReport (user, events, morning, filters) {
    let url = '/calendar?'
    
    // if morning is true, the url should be /calendar?date=YYYY-MM-DD
    // else it should be /calendar?filters=JSON.stringify(filters)
    if (morning) {
      url += 'date=' + moment().format('YYYY-MM-DD')
    } else {
      url += 'filters=' + encodeURIComponent(JSON.stringify({
        createdAt: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      }))
    }
    
    return this.queue.pushTo('SendEmail', {
      'to': user.email,
      'from': 'info@globalgroup.consulting',
      'subject': morning ? 'Eventi in programma per oggi' : 'Eventi creati oggi',
      'alias': 'main-calendar-report',
      'templateData': {
        subject: morning ? 'Eventi in programma per oggi' : 'Eventi creati oggi',
        'content': morning ? 'Ecco gli eventi in programma per oggi:' : 'Ecco gli eventi creati oggi:',
        receiver: user,
        events,
        action: {
          text: 'Visualizza eventi',
          link: Env.get('APP_URL') + url
        }
      }
    })
  }
}

/**
 * @type {QueueProvider}
 */
module.exports = QueueProvider
