/**
 *
 * @param {typeof import('@adonisjs/framework/src/Route/Manager')} Route
 */
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'CalendarCategoryController.index')
    
    Route.post('/:id?', 'CalendarCategoryController.upsert')
      .validator('CalendarCategories/UpsertCalendarCategory')
    
    Route.delete('/:id', 'CalendarCategoryController.destroy')
  }).prefix('/api/calendarCategories')
    .middleware('auth')
    .namespace('Api')
}
