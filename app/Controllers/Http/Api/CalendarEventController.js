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
    return CalendarEvent.all()
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
   * Display a single calendarevent.
   * GET calendar events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
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
  }
}

module.exports = CalendarEventController
