'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { castToObjectId } = require('../../../Helpers/ModelFormatters')
/** @type {typeof import('../../../Models/CalendarEventComment')} */
const CalendarEventComment = use('App/Models/CalendarEventComment')
const CalendarEventCommentPolicy = use('App/Policies/CalendarEventCommentPolicy')

const AclForbiddenException = require('../../../Exceptions/Acl/AclForbiddenException')
const WithPolicyController = require('../../../../classes/WithPolicyController')

/**
 * Resourceful controller for interacting with calendareventcomments
 */
class CalendarEventCommentController extends WithPolicyController {
  
  /**
   * Show a list of all calendareventcomments.
   * GET calendareventcomments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async readForEvent ({ request, response, view, params }) {
    return CalendarEventComment.where({ 'eventId': castToObjectId(params.eventId) })
      .with('author')
      .sort({ created_at: -1 }).fetch()
  }
  
  /**
   * Create/save a new calendareventcomment.
   * POST calendareventcomments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async upsert ({ request, response, params, auth }) {
    const eventId = params.eventId
    const commentId = params.id
    let comment
    
    // if commentId is set, we update the comment
    if (commentId) {
      comment = await CalendarEventComment.findOrFail(commentId)
      
      comment.message = request.input('message')
      
      await comment.save()
    } else {
      // otherwise we create a new comment
      comment = await CalendarEventComment.create({
        eventId,
        authorId: auth.user._id,
        message: request.input('message'),
        readings: [
          // the author has read the comment
          {
            userId: auth.user._id,
            createdAt: new Date()
          }
        ]
      })
    }
    
    return comment
  }
  
  /**
   * Delete a calendareventcomment with id.
   * DELETE calendareventcomments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const comment = await CalendarEventComment.findOrFail(params.id)
    
    if (comment.authorId.toString() !== auth.user._id.toString()) {
      throw new AclForbiddenException()
    }
    
    await comment.delete()
    
    return response.status(204).send('Ok')
  }
}

module.exports = CalendarEventCommentController
