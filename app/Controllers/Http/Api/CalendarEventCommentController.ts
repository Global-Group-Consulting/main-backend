const { castToObjectId } = require('../../../Helpers/ModelFormatters')
const AclForbiddenException = require('../../../Exceptions/Acl/AclForbiddenException')
import WithPolicyController from '../../../../classes/WithPolicyController'

const CalendarEventComment = use('App/Models/CalendarEventComment')

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
   */
  async readForEvent ({ request, response, view, params }: ControllerContext<{ eventId: string }>) {
    return CalendarEventComment.where({ 'eventId': castToObjectId(params.eventId) })
      .with('author')
      .sort({ created_at: -1 })
      .fetch()
  }
  
  /**
   * Create/save a new CalendarEventComment.
   * POST CalendarEventComments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async upsert ({ request, response, params, auth }: ControllerContext<{ eventId: string, id: string }>) {
    const eventId = params.eventId
    const commentId = params.id
    let comment
    
    // if commentId is set, we update the comment
    if (commentId) {
      comment = await CalendarEventComment.findOrFail(commentId)
      
      comment.message = request.input('message').trim()
  
      // Reset the readings so that the other users can see that the comment has been updated
      comment.readings = [{
        userId: auth.user._id,
        createdAt: new Date()
      }]
  
      await comment.save()
    } else {
      // otherwise we create a new comment
      comment = await CalendarEventComment.create({
        eventId,
        authorId: auth.user._id,
        message: request.input('message').trim(),
        readings: [
          // the author has read the comment
          {
            userId: auth.user._id,
            createdAt: new Date()
          }
        ]
      })
  
      comment.created_at
    }
    
    return comment
  }
  
  /**
   * Delete a CalendarEventComment with id.
   * DELETE CalendarEventComments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }: ControllerContext<{ id: string }>) {
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
   * @param {id: string} params
   * @param request
   * @param response
   * @param auth
   * @return {Promise<any[]>}
   */
  async markAsRead ({ params, request, response, auth }: ControllerContext<{ id: string }>) {
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

export = CalendarEventCommentController
