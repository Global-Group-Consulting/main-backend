'use strict'

/** @type {typeof import('../../@types/Model').Model} */
const Model = use('Model')

/**
 * @property {string} name
 * @property {string} color
 */
class CalendarCategory extends Model {
  
  events () {
    return this.hasMany('App/Models/CalendarEvent', '_id', 'categoryId')
  }
  
  author () {
    return this.belongsTo('App/Models/User', '_id', 'authorId')
  }
}

module.exports = CalendarCategory
