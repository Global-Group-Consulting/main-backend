const { castToObjectId } = require('../Helpers/ModelFormatters')

const Model = use('Model')

interface CalendarEventCommentReading {
  userId: string
  createdAt: Date
}

class CalendarEventComment extends Model {
  declare authorId: string
  declare eventId: string
  declare message: string
  declare readings: CalendarEventCommentReading[]
  
  author () {
    return this.belongsTo('App/Models/User', 'authorId', '_id').select(['_id', 'firstName', 'lastName'])
  }
  
  event () {
    return this.belongsTo('App/Models/CalendarEvent', 'eventId', '_id')
  }
  
  setAuthorId (value: string) {
    return castToObjectId(value)
  }
  
  setEventId (value: string) {
    return castToObjectId(value)
  }
  
  setReadings (value: CalendarEventCommentReading[]) {
    return value.map((reading) => ({
        ...reading,
        userId: castToObjectId(reading.userId)
      })
    )
    
  }
}

export = CalendarEventComment
