/**
 *
 * @param {typeof import('@adonisjs/framework/src/Route/Manager')} Route
 */
module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'CalendarCategoryController.index')
    Route.post('/', 'CalendarCategoryController.store')
      .validator('CalendarCategories/StoreCalendarCategory')
    
    Route.patch('/:id', 'CalendarCategoryController.update')
      .validator('CalendarCategories/UpdateCalendarCategory')
    
    Route.delete('/:id', 'CalendarCategoryController.destroy')
  }).prefix('/api/calendarCategories')
    .middleware('auth')
    .namespace('Api')
}
