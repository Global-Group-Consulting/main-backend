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
     */
    readForEvent({ params }) {
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
     */
    upsert({ request, params, auth }) {
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
     */
    destroy({ params, response, auth }) {
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
     */
    markAsRead({ params, auth }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FsZW5kYXJFdmVudENvbW1lbnRDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ2FsZW5kYXJFdmVudENvbW1lbnRDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQTtBQUN0RixvR0FBMkU7QUFFM0UsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUVuRTs7R0FFRztBQUNILE1BQU0sOEJBQStCLFNBQVEsOEJBQW9CO0lBRS9EOzs7T0FHRztJQUNHLFlBQVksQ0FBRSxFQUFFLE1BQU0sRUFBMEM7O1lBQ3BFLE9BQU8sb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztpQkFDN0UsSUFBSSxDQUFDLFFBQVEsQ0FBQztpQkFDZCxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDeEIsS0FBSyxFQUFFLENBQUE7UUFDWixDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxNQUFNLENBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBc0Q7O1lBQ3pGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7WUFDOUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQTtZQUMzQixJQUFJLE9BQU8sQ0FBQTtZQUVYLDZDQUE2QztZQUM3QyxJQUFJLFNBQVMsRUFBRTtnQkFDYixPQUFPLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBRTFELE9BQU8sQ0FBQyxPQUFPLEdBQUcs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