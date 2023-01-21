'use strict'

/** @typedef {Adonis.Http.Request} Request */
/** @typedef {import('../../../../@types/HttpRequest').HttpRequest} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('../../../../@types/Auth').Auth} Auth */

const { castToObjectId } = require('../../../Helpers/ModelFormatters')
/**
 * @type {typeof import('../../../Models/CalendarEvent')}
 */
const CalendarEvent = use('App/Models/CalendarEvent')
const User = use('App/Models/User')

const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')

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
   * @param {Auth} ctx.auth
   */
  async index ({ request, response, auth }) {
    const authId = auth.user._id
    const { start, end } = request.only(['start', 'end'])
    
    const query = {
      start: {
        $gte: new Date(start)
      },
      end: {
        $lte: new Date(end)
      }
    }
    
    // Only show events to admins or agents
    if (!auth.user.isAdmin() && !auth.user.isAgent()) {
      throw new AclForbiddenException('You don\'t have permission to access this resource')
    }
    // If user is an admin, must see all events
    // No authId filter must be added
    
    // if user is agent, must see only his events and those of his subagents
    if (auth.user.isAgent()) {
      query.$or = [
        // get all public events and those of the user, alongside those of his subagents
        { isPublic: true },
        // Temporarily we'll just get the events of the user because getting those of the subagents is more slower
        // { authorId: { $in: await User.getTeamUsersIds(auth.user, false, true) } }
        { authorId: authId },
        { userId: authId }
      ]
    }
    
    return CalendarEvent.where(query)
      .with(['category', 'client', 'user'])
      .sort({ 'start': 1 })
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
     * @type {User}
     */
    const authUser = auth.user
    
    let userId = !auth.user.isAdmin() ? auth.user._id.toString() : data.userId
    
    // if user is not admin, must check if the userId is the same as the authorId or of one of its subagents
    if (!auth.user.isAdmin() && data.userId) {
      const subagentIds = await User.getTeamAgents(authUser, false, true, true)
      
      // if the specified user is not a subagents of the author, set as user itself
      if (!subagentIds.includes(data.userId)) {
        userId = authUser._id.toString()
      } else {
        userId = data.userId
      }
    }
    
    /**
     * @type {CalendarEvent & Model}
     */
    const calendarEvent = await CalendarEvent.create({
      ...data,
      authorId: auth.user._id,
      // If a user is NOT and admin, the userId must be the same as the authorId
      userId: userId,
      // if user is admin and a userId is provided, the event is not public, otherwise it is
      isPublic: auth.user.isAdmin() ? (!data.userId) : false
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
   * @param {Auth} ctx.auth
   */
  async update ({ params, request, response, auth }) {
    const eventId = params.id
    const data = request.all()
    /**
     * @type {CalendarEvent & Model}
     */
    const calendarEvent = await CalendarEvent.findOrFail(eventId)
    
    // Users can delete only their own events, or if they are admins, they can delete any event
    if (calendarEvent.authorId.toString() !== auth.user._id.toString() && !auth.user.isAdmin()) {
      throw new AclForbiddenException('You don\'t have permission to access this resource')
    }
    
    /**
     * @type {User}
     */
    const authUser = auth.user
    
    let userId = !auth.user.isAdmin() ? auth.user._id.toString() : data.userId
    
    // if user is not admin, must check if the userId is the same as the authorId or of one of its subagents
    if (!auth.user.isAdmin() && data.userId) {
      const subagentIds = await User.getTeamAgents(authUser, false, true, true)
      
      // if the specified user is not a subagents of the author, set as user itself
      if (!subagentIds.includes(data.userId)) {
        userId = authUser._id.toString()
      } else {
        userId = data.userId
      }
    }
    
    calendarEvent.merge({
      ...data,
      // If a user is NOT and admin, the userId must be the same as the authorId
      userId,
      // if user is admin and a userId is provided, the event is not public, otherwise it is
      isPublic: auth.user.isAdmin() ? (!data.userId) : false
    })
    
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
   * @param {Auth} ctx.auth
   */
  async destroy ({ params, request, response, auth }) {
    const eventId = params.id
    /**
     * @type {CalendarEvent & Model}
     */
    const calendarEvent = await CalendarEvent.findOrFail(eventId)
    
    // Users can delete only their own events, or if they are admins, they can delete any event
    if (calendarEvent.authorId.toString() !== auth.user._id.toString() && !auth.user.isAdmin()) {
      throw new AclForbiddenException('You don\'t have permission to access this resource')
    }
    
    await calendarEvent.delete()
  }
}

module.exports = CalendarEventController
