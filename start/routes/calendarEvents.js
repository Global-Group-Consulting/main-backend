/**
 *
 * @param {typeof import('@adonisjs/framework/src/Route/Manager')} Route
 */
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'CalendarEventController.index')
    Route.post('/', 'CalendarEventController.store')
      .validator('CalendarEvents/StoreCalendarEvent')
    
  }).prefix('/api/calendarEvents')
    .middleware('auth')
    .namespace('Api')
}
