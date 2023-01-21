'use strict'

/** @typedef {Adonis.Http.Request} Request */
/** @typedef {import('../../../../@types/HttpRequest').HttpRequest} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('../../../../@types/Auth').Auth} Auth */

const { castToObjectId } = require('../../../Helpers/ModelFormatters')
/**
 * @type {typeof import('../../../Models/CalendarCategory')}
 */
const CalendarCategory = use('App/Models/CalendarCategory')

/**
 * @type {typeof import('../../../Models/CalendarEvent')}
 */
const CalendarEvent = use('App/Models/CalendarEvent')

const CalendarException = use('App/Exceptions/CalendarException')

/**
 * Resourceful controller for interacting with calendarcategories
 */
class CalendarCategoryController {
  /**
   * Show a list of all calendarcategories.
   * GET calendarcategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return await CalendarCategory.sort({ 'name': 1 }).fetch()
  }
  
  /**
   * Update calendarcategory details.
   * PUT or PATCH calendarcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async upsert ({ params, request, response }) {
    const categoryId = params.id
    const data = request.all()
    let calendarCategory = categoryId ? await CalendarCategory.findOrFail(categoryId) : null
    
    if (calendarCategory) {
      calendarCategory.merge(data)
      
      await calendarCategory.save()
    } else {
      calendarCategory = await CalendarCategory.create(data)
    }
    
    return calendarCategory
  }
  
  /**
   * Delete a calendarcategory with id.
   * DELETE calendarcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const categoryId = params.id
    const calendarCategory = await CalendarCategory.findOrFail(categoryId)
    
    const usedCounter = await CalendarEvent.where({ 'categoryId': castToObjectId(categoryId) }).count()
    
    if (usedCounter > 0) {
      throw new CalendarException('Questa categoria è in uso e non può essere eliminata')
    }
    
    await calendarCategory.delete()
  }
}

module.exports = CalendarCategoryController
