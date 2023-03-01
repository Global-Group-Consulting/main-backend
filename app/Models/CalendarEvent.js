'use strict'

const { castToObjectId, castToBoolean } = require('../Helpers/ModelFormatters')
/** @type {typeof import('../../@types/Model').Model} */
const Model = use('Model')

/**
 * @property {string} name
 * @property {string} notes
 * @property {boolean} timed - false for all day events, true for timed events
 * @property {string} start
 * @property {string} end
 * @property {ObjectId} categoryId - ID of the category this event belongs to
 * @property {string} place
 * @property {boolean} isPublic - true if the event is public, false if it's private
 * @property {ObjectId} authorId - the user who created the event
 * @property {ObjectId[]} userIds - the users who the event belongs to. This is the user who will see the event in their calendar. For admins, this could be empty, indicating global events.
 * @property {ObjectId} clientId - the client indirectly related to the event
 * @property {ObjectId} updatedBy - the user who created/updated the event
 */
class CalendarEvent extends Model {
  static get computed () {
    // return ['canEdit']
  }
  
  static get dates () {
    return super.dates.concat(['start', 'end'])
  }
  
  static boot () {
    super.boot()
    
    this.addHook('afterCreate', 'CalendarHook.afterCreate')
    this.addHook('afterUpdate', 'CalendarHook.afterUpdate')
  }
  
  client () {
    return this.belongsTo('App/Models/User', 'clientId', '_id').select(['_id', 'firstName', 'lastName'])
  }
  
  author () {
    return this.belongsTo('App/Models/User', 'authorId', '_id').select(['_id', 'firstName', 'lastName'])
  }
  
  users () {
    return this.referMany('App/Models/User', '_id', 'userIds').select(['_id', 'firstName', 'lastName'])
  }
  
  category () {
    return this.belongsTo('App/Models/CalendarCategory', 'categoryId', '_id')
  }
  
  /*  getCanEdit ({ authorId, userId, isPublic }) {
      if (isPublic) {
        return false
      }
      
      return authorId === userId
    }*/
  
  setTimed (timed) {
    return castToBoolean(timed)
  }
  
  setCategoryId (categoryId) {
    return castToObjectId(categoryId)
  }
  
  setAuthorId (authorId) {
    return castToObjectId(authorId)
  }
  
  setUserIds (userIds) {
    if (!Array.isArray(userIds)) {
      return []
    }
    return userIds.map(userId => castToObjectId(userId))
  }
  
  setClientId (clientId) {
    return castToObjectId(clientId)
  }
}

module.exports = CalendarEvent
