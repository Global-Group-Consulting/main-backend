"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const { castToObjectId } = require('../../../Helpers/ModelFormatters');
const AclForbiddenException = require('../../../Exceptions/Acl/AclForbiddenException');
const WithPolicyController_1 = __importDefault(require("../../../../classes/WithPolicyController"));
const CalendarEventComment = use('App/Models/CalendarEventComment');
/**
 * Resourceful controller for interacting with CalendarEventComments
 */
class CalendarEventCommentController extends WithPolicyController_1.default {
    /**
     * Show a list of all CalendarEventComments.
     * GET CalendarEventComments
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    readForEvent({ request, response, view, params }) {
        return __awaiter(this, void 0, void 0, function* () {
            return CalendarEventComment.where({ 'eventId': castToObjectId(params.eventId) })
                .with('author')
                .sort({ created_at: -1 })
                .fetch();
        });
    }
    /**
     * Create/save a new CalendarEventComment.
     * POST CalendarEventComments
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    upsert({ request, response, params, auth }) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = params.eventId;
            const commentId = params.id;
            let comment;
            // if commentId is set, we update the comment
            if (commentId) {
                comment = yield CalendarEventComment.findOrFail(commentId);
                comment.message = request.input('message').trim();
                // Reset the readings so that the other users can see that the comment has been updated
                comment.readings = [{
                        userId: auth.user._id,
                        createdAt: new Date()
                    }];
                yield comment.save();
            }
            else {
                // otherwise we create a new comment
                comment = yield CalendarEventComment.create({
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
                });
                comment.created_at;
            }
            return comment;
        });
    }
    /**
     * Delete a CalendarEventComment with id.
     * DELETE CalendarEventComments/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    destroy({ params, request, response, auth }) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield CalendarEventComment.findOrFail(params.id);
            if (comment.authorId.toString() !== auth.user._id.toString()) {
                throw new AclForbiddenException();
            }
            yield comment.delete();
            response.ok();
        });
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
    markAsRead({ params, request, response, auth }) {
        return __awaiter(this, void 0, void 0, function* () {
            /** Get the comment */
            const comment = yield CalendarEventComment.findOrFail(params.id);
            // check if the user has already read the comment
            const reading = comment.readings.find((reading) => reading.userId.toString() === auth.user._id.toString());
            // if not, we add a new reading
            if (!reading) {
                comment.readings.push({
                    userId: auth.user._id,
                    createdAt: new Date()
                });
                yield comment.save();
            }
            return comment.readings;
        });
    }
}
module.exports = CalendarEventCommentController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FsZW5kYXJFdmVudENvbW1lbnRDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ2FsZW5kYXJFdmVudENvbW1lbnRDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQTtBQUN0RixvR0FBMkU7QUFFM0UsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUVuRTs7R0FFRztBQUNILE1BQU0sOEJBQStCLFNBQVEsOEJBQW9CO0lBRS9EOzs7Ozs7OztPQVFHO0lBQ0csWUFBWSxDQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUEwQzs7WUFDN0YsT0FBTyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2lCQUM3RSxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUNkLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2lCQUN4QixLQUFLLEVBQUUsQ0FBQTtRQUNaLENBQUM7S0FBQTtJQUVEOzs7Ozs7O09BT0c7SUFDRyxNQUFNLENBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQXNEOztZQUNuRyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBO1lBQzlCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUE7WUFDM0IsSUFBSSxPQUFPLENBQUE7WUFFWCw2Q0FBNkM7WUFDN0MsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsT0FBTyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsVUFB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