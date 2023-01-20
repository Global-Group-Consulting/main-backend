'use strict'

/** @typedef {Adonis.Http.Request} Request */
/** @typedef {import('../../../../@types/HttpRequest').HttpRequest} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('../../../../@types/Auth').Auth} Auth */

/**
 * @type {typeof import('../../../Models/CalendarEvent')}
 */
const CalendarEvent = use('App/Models/CalendarEvent')

/**
 * Resourceful controller for interacting with calendar events
 */
class CalendarEventController {
  /**
   * Show a list of all calendar events.
   * GET calendar events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ request, response }) {
    
    // TODO:: must filter by dates and logged user
    return CalendarEvent.query()
      .with('category')
      .fetch()
  }
  
  /**
   * Create/save a new calendar event.
   * POST calendar events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store ({ request, response, auth }) {
    const data = request.all()
    
    /**
     * @type {CalendarEvent}
     */
    const calendarEvent = await CalendarEvent.create({
      ...data,
      authorId: auth.user._id
    })
    
    return calendarEvent
  }
  
  /**
   * Update calendarevent details.
   * PUT or PATCH calendar events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const eventId = params.id
    const data = request.all()
    const calendarEvent = await CalendarEvent.findOrFail(eventId)
    
    calendarEvent.merge(data)
    
    await calendarEvent.save()
    
    return calendarEvent
  }
  
  /**
   * Delete a calendarevent with id.
   * DELETE calendar events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const eventId = params.id
    const calendarEvent = await CalendarEvent.findOrFail(eventId)
    
    await calendarEvent.delete()
  }
}

module.exports = CalendarEventController
