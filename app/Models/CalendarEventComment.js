'use strict'

const { castToObjectId } = require('../Helpers/ModelFormatters')

/** @type {typeof import('../../@types/Model').Model} */
const Model = use('Model')


class CalendarEventComment extends Model {
  author () {
    return this.belongsTo('App/Models/User', 'authorId', '_id').select(['_id', 'firstName', 'lastName'])
  }
  
  event () {
    return this.belongsTo('App/Models/CalendarEvent', 'eventId', '_id')
  }
  
  setAuthorId (value) {
    return castToObjectId(value)
  }
  
  setEventId (value) {
    return castToObjectId(value)
  }
  
  setReadings (value) {
    return value.map((reading) => ({
        ...reading,
        userId: castToObjectId(reading.userId)
      })
    )
    
  }
}

module.exports = CalendarEventComment
