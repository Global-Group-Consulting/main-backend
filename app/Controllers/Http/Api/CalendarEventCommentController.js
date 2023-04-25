'use strict'

const { castToObjectId } = require('../../../Helpers/ModelFormatters')
const CalendarEventComment = use('App/Models/CalendarEventComment')

const AclForbiddenException = require('../../../Exceptions/Acl/AclForbiddenException')
const WithPolicyController = require('../../../../classes/WithPolicyController')

/**
 * Resourceful controller for interacting with CalendarEventComments
 */
class CalendarEventCommentController extends WithPolicyController {
  
  /**
   * Show a list of all CalendarEventComments.
   * GET CalendarEventComments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   *
   * @return {Promise<CalendarEventComment>}
   */
  async readForEvent ({ request, response, view, params }) {
    return CalendarEventComment.where({ 'eventId': castToObjectId(params.eventId) })
      .with('author')
      .sort({ created_at: -1 })
      .fetch()
  }
  
  /**
   * Create/save a new CalendarEventComment.
   * POST CalendarEventComments
   *
   * @param {ControllerContext} ctx
   */
  async upsert ({ request, response, params, auth }) {
    const eventId = params.eventId
    const commentId = params.id
    let comment
    
    // if commentId is set, we update the comment
    if (commentId) {
      comment = await CalendarEventComment.findOrFail(commentId)
  
      comment.message = request.input('message').toString().trim()
  
      // Reset the readings so that the other users can see that the comment has been updated
      comment.readings = [{
        userId: auth.user._id,
        createdAt: new Date()
      }]
  
      await comment.save()
    } else {
      // otherwise we create a new comment
      /**
       * @type {CalendarEventComment}
       */
      comment = await CalendarEventComment.create({
        eventId,
        authorId: auth.user._id,
        message: request.input('message').toString().trim(),
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
   * Delete a CalendarEventComment with id.
   * DELETE CalendarEventComments/:id
   *
   * @param {ControllerContext} ctx
   */
  async destroy ({ params, request, response, auth }) {
    const comment = await CalendarEventComment.findOrFail(params.id)
  
    if (comment.authorId.toString() !== auth.user._id.toString()) {
      throw new AclForbiddenException()
    }
  
    await comment.delete()
  
    response.ok()
  }
  
  /**
   * Set the comment as read by the current user. No policy check is done here.
   *
   * @param {ControllerContext<{id:string}>} ctx
   * @return {Promise<any[]>}
   */
  async markAsRead ({ params, request, response, auth }) {
    /** Get the comment */
    const comment = await CalendarEventComment.findOrFail(params.id)
  
    // check if the user has already read the comment
    const reading = comment.readings.find((reading) => reading.userId.toString() === auth.user._id.toString())
  
    // if not, we add a new reading
    if (!reading) {
      comment.readings.push({
        userId: auth.user._id,
        createdAt: new Date()
      })
      
      await comment.save()
    }
    
    return comment.readings
  }
}

module.exports = CalendarEventCommentController
