'use strict'

const { castToObjectId } = require('../Helpers/ModelFormatters')

/** @type {typeof import('../../@types/Model').Model} */
const Model = use('Model')

/**
 * @property {ObjectId} _id
 * @property {ObjectId} authorId
 * @property {ObjectId} eventId
 * @property {string} message
 * @property {{userId: ObjectId, createdAt: string}[]} readings
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} test
 */
class CalendarEventComment extends Model {
  author () {
    return this.belongsTo('App/Models/User', 'authorId', '_id').select(['_id', 'firstName', 'lastName'])
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
