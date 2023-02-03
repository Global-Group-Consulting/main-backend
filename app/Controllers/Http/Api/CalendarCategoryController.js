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
/** @type {import('../../../../providers/Acl/index')} */
const AclProvider = use('AclProvider')

const AclUserRoles = require('../../../../enums/AclUserRoles')
const CalendarCategoryVisibility = require('../../../../enums/CalendarCategoryVisibility')

/**
 * Resourceful controller for interacting with calendarcategories
 */
class CalendarCategoryController {
  /**
   * Show a list of all calendarcategories.
   * GET calendarcategories
   *
   * @param {object} ctx
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth }) {
    /**
     * @type {User}
     */
    const authUser = auth.user
    
    const query = {}
    
    // if user is admin or super admin, show all categories
    if (!authUser.hasRoles([AclUserRoles.ADMIN, AclUserRoles.SUPER_ADMIN])) {
      const roles = [...authUser.roles]
      
      if (roles.includes(AclUserRoles.SUPER_ADMIN) && !roles.includes(AclUserRoles.ADMIN)) {
        roles.push(AclUserRoles.ADMIN)
      }
      
      query['$or'] = [
        { visibility: CalendarCategoryVisibility.ALL },
        {
          visibility: CalendarCategoryVisibility.ME,
          authorId: castToObjectId(authUser._id)
        },
        {
          visibility: { '$in': roles }
        }
      ]
    }
    
    return await CalendarCategory
      .where(query)
      .with('author')
      .sort({ 'name': 1 })
      .fetch()
  }
  
  /**
   * Update calendarcategory details.
   * PUT or PATCH calendarcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async upsert ({ params, request, auth }) {
    const categoryId = params.id
    const data = request.all()
    let calendarCategory = categoryId ? await CalendarCategory.findOrFail(categoryId) : null
    
    if (calendarCategory) {
      calendarCategory.merge(data)
      
      await calendarCategory.save()
    } else {
      calendarCategory = new CalendarCategory()
      calendarCategory.fill(data)
      calendarCategory.authorId = auth.user._id
      await calendarCategory.save()
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
