/**
 *
 * @param {typeof import('@adonisjs/framework/src/Route/Manager')} Route
 */
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/:eventId', 'CalendarEventCommentController.readForEvent')
  
    Route.post('/:eventId/:id?', 'CalendarEventCommentController.upsert')
      .validator('CalendarEventComments/upsert')
  
    Route.patch('/:id/markAsRead', 'CalendarEventCommentController.markAsRead')
  
    Route.delete('/:id', 'CalendarEventCommentController.destroy')
  
  }).prefix('/api/calendarEventComments')
    .middleware('auth')
    .namespace('Api')
}
