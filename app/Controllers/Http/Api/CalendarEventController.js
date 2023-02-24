'use strict'

/** @typedef {HttpRequest} HttpRequest */
/** @typedef {import('../../../../@types/HttpRequest').HttpRequest} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('../../../../@types/Auth').Auth} Auth */

/**
 * @type {typeof import('../../../Models/CalendarEvent')}
 */
const CalendarEvent = use('App/Models/CalendarEvent')
const User = use('App/Models/User')

const AclForbiddenException = use('App/Exceptions/Acl/AclForbiddenException')

const CalendarFiltersMap = require('../../../Filters/CalendarFilters.map')
const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const { preparePaginatedResult, prepareSorting } = require('../../../Utilities/Pagination')
const { prepareExcelSheet, ExcelCreator } = require('../../../Utilities/ExcelCreator')
const ExcelJS = require('exceljs')
const moment = require('moment')
const { userFullName } = require('../../../Utilities/Formatters')

/**
 * Resourceful controller for interacting with calendar events
 */
class CalendarEventController {
  
  _prepareFiltersQuery (pagination, auth) {
    const authId = auth.user._id
    const filtersQuery = prepareFiltersQuery(pagination.filters, CalendarFiltersMap)
    let sort = prepareSorting(pagination, { 'start': -1 })
    
    // Only show events to admins or agents
    if (!auth.user.isAdmin() && !auth.user.isAgent()) {
      throw new AclForbiddenException('You don\'t have permission to access this resource')
    }
    // If user is an admin, must see all events
    // No authId filter must be added
    
    // if user is agent, must see only his events and those of his subagents
    if (auth.user.isAgent()) {
      filtersQuery.$or = [
        // get all public events and those of the user, alongside those of his subagents
        { isPublic: true },
        // Temporarily we'll just get the events of the user because getting those of the subagents is more slower
        // { authorId: { $in: await User.getTeamUsersIds(auth.user, false, true) } }
        { authorId: authId },
        { userIds: authId }
      ]
    }
    
    return {
      filtersQuery,
      sort
    }
  }
  
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
    const { filtersQuery, sort } = this._prepareFiltersQuery(request.pagination, auth)
    
    const query = CalendarEvent.where(filtersQuery)
      .with(['category', 'client', 'users'])
      .sort(sort)
    
    if (request.input('paginate') === 'true') {
      return preparePaginatedResult((await query.paginate(request.pagination.page)).toJSON(), sort, filtersQuery)
    } else {
      return await query.fetch()
    }
  }
  
  async download ({ request, response, auth }) {
    const { filtersQuery, sort } = this._prepareFiltersQuery(request.pagination, auth)
    const query = CalendarEvent.where(filtersQuery)
      .with(['category', 'client', 'users', 'author'])
      .sort(sort)
    
    const data = await query.fetch()
    const sheet = new ExcelCreator('elenco_eventi' + Date.now(), 'Elenco eventi')
    
    sheet.setColumns([
      { header: 'Titolo', key: 'name', width: 30 },
      { header: 'Inizio', key: 'start', width: 15 },
      { header: 'Fine', key: 'end', width: 15 },
      { header: 'Luogo', key: 'place', width: 30 },
      { header: 'Categoria', key: 'category', width: 30 },
      { header: 'Note', key: 'notes', width: 40 },
      { header: 'Agenti', key: 'users', width: 30 },
      { header: 'Cliente', key: 'client', width: 30 },
      { header: 'Pubblico', key: 'isPublic', width: 15 },
      { header: 'Creato il', key: 'createdAt', width: 30 },
      { header: 'Creato da', key: 'author', width: 30 }
    ])
    
    sheet.setRows(data.toJSON().map((event) => ({
      ...event,
      start: event.start ? moment(event.start).format('DD/MM/YYYY HH:mm') : '',
      end: event.end ? moment(event.end).format('DD/MM/YYYY HH:mm') : '',
      category: event.category ? event.category.name : '',
      users: event.users ? event.users.map((user) => userFullName(user)).join(', ') : '',
      client: event.client ? userFullName(event.client) : '',
      author: event.author ? userFullName(event.author) : '',
      isPublic: event.isPublic ? 'Si' : 'No',
      createdAt: event.created_at ? moment(event.created_at).format('DD/MM/YYYY HH:mm') : ''
    })))
    
    response.attachment(await sheet.export())
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
    
    let userIds = !auth.user.isAdmin() ? [auth.user._id.toString()] : data.userIds
    
    // if user is not admin, must check if the userId is the same as the authorId or of one of its subagents
    if (!auth.user.isAdmin() && data.userIds) {
      const subagentIds = await User.getTeamAgents(authUser, false, true, true)
  
      // if the specified user is not a subagents of the author, set as user itself
      if (!subagentIds.some((id) => data.userIds.includes(id))) {
        userIds = [authUser._id.toString()]
      } else {
        userIds = data.userIds
      }
    }
  
    /**
     * @type {CalendarEvent & Model}
     */
    const calendarEvent = await CalendarEvent.create({
      ...data,
      authorId: auth.user._id,
      // If a user is NOT and admin, the userId must be the same as the authorId
      userIds: userIds,
      // if user is admin and a userId is provided, the event is not public, otherwise it is
      isPublic: auth.user.isAdmin() ? (!data.userIds || !data.userIds.length) : false
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
      throw new AclForbiddenException()
    }
    
    /**
     * @type {User}
     */
    const authUser = auth.user
    
    let userIds = !auth.user.isAdmin() ? [auth.user._id.toString()] : data.userIds
    
    // if user is not admin, must check if the userId is the same as the authorId or of one of its subagents
    if (!auth.user.isAdmin() && data.userIds) {
      /**
       * @type {string[]}
       */
      const subagentIds = await User.getTeamAgents(authUser, false, true, true)
      
      // if the specified user is not a subagents of the author, set as user itself
      if (!subagentIds.some((id) => data.userIds.includes(id))) {
        userIds = [authUser._id.toString()]
      } else {
        userIds = data.userIds
      }
    }
  
    // if a clientId is provided, ensure clientName gets reset
    if (data.clientId) {
      data.clientName = null
    }
    
    calendarEvent.merge({
      ...data,
      // If a user is NOT and admin, the userId must be the same as the authorId
      userIds,
      // if user is admin and a userId is provided, the event is not public, otherwise it is
      isPublic: auth.user.isAdmin() ? (!data.userIds || !data.userIds.length) : false
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
      throw new AclForbiddenException()
    }
    
    await calendarEvent.delete()
  }
}

module.exports = CalendarEventController
