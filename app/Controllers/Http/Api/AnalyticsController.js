const { preparePaginatedResult, prepareSorting } = require('../../../Utilities/Pagination')
const { prepareFiltersQuery } = require('../../../Filters/PrepareFiltersQuery')
const Analytic = use('App/Models/Analytic')
const AnalyticFiltersMap = require('../../../Filters/AnalyticFilters.map')
const { castToObjectId } = require('../../../Helpers/ModelFormatters')

class AnalyticsController {
  async read ({ request, response }) {
    const model = await Analytic.getConnection()
    const filters = prepareFiltersQuery(request.pagination.filters, AnalyticFiltersMap)
    const sorting = prepareSorting(request.pagination)
    const sortQuery = { ...sorting }
    
    // Because user is a complex object, we need to sort by user.lastName and user.firstName
    if (!!sortQuery['user']) {
      sortQuery['user.lastName'] = sortQuery['user']
      sortQuery['user.firstName'] = sortQuery['user']
      
      delete sortQuery['user']
    }
    
    const q = Analytic.query({})
    q.collection = 'analytics_group_users'
    
    const data = (await q.where(filters)
        .with('user')
        .sort(sortQuery)
        .paginate(request.pagination.page)
    ).toJSON()
    
    return preparePaginatedResult(data, sorting, request.pagination.filters)
  }
  
  async store ({ request, response }) {
    /**
     * @type {ISession}
     */
    const data = request.all()
    
    // Try to find the same session
    const session = await Analytic.findBy('sessionId', data.id)
    
    try {
      if (session) {
        session.timers = data.timers
        session.totalTime = data.timers.reduce((acc, timer) => acc + timer.timeOnPage, 0)
        session.save()
      } else {
        Analytic.create({
          sessionDate: data.createdAt,
          sessionId: data.id,
          user: data.user,
          userId: castToObjectId(data.user.id),
          timers: data.timers,
          totalTime: data.timers.reduce((acc, timer) => acc + timer.timeOnPage, 0)
        }).then()
      }
    } catch (e) {
      console.log(e)
    }
  }
  
}

module.exports = AnalyticsController
