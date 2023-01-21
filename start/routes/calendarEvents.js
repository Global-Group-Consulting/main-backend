/**
 *
 * @param {typeof import('@adonisjs/framework/src/Route/Manager')} Route
 */
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'CalendarEventController.index')
      .validator('CalendarEvents/IndexCalendarEvent')
    
    Route.post('/', 'CalendarEventController.store')
      .validator('CalendarEvents/StoreCalendarEvent')
    
    Route.patch('/:id', 'CalendarEventController.update')
      .validator('CalendarEvents/UpdateCalendarEvent')
    
    Route.delete('/:id', 'CalendarEventController.destroy')
      .validator('CalendarEvents/DeleteCalendarEvent')
  }).prefix('/api/calendarEvents')
    .middleware('auth')
    .namespace('Api')
}
