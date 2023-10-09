const { prepareSorting, preparePaginatedResult } = require('../../Utilities/Pagination')
const { AggregationBuilder } = require('../../../classes/AggregationBuilder')
const { omit, clone } = require('lodash')
const RequestStatus = require('../../../enums/RequestStatus')

// const Request = use('App/Models/Request')

/**
 * @param {any} filter
 * @param {any} project
 * @param {import('/@types/HttpRequest').RequestPagination} requestPagination
 * @return {Promise<PaginatedResult>}
 */
module.exports.filter = async function (filter = {}, project, requestPagination, user) {
  // store original filter to use it later when returning the result
  const originalFilter = clone(filter)
  let sort = prepareSorting(requestPagination /*{ 'created_at': -1, 'updated_at': -1, 'completed_at': -1 }*/)

  const start = Date.now()

  const pendingRequests = await user.requests().where({ status: { $in: [RequestStatus.LAVORAZIONE, RequestStatus.NUOVA] } }).fetch()

  let result = (await this.where(filter)
    .setVisible(project, null)
    .sort(sort)
    .paginate(requestPagination.page)).toJSON()

  const end = Date.now()

  result.time = end - start

 /* if (requestPagination.page <= 1) {
    result.data.unshift(...pendingRequests.rows.map(r => {
      return {
        id: r._id,
        _id: r._id,
        amountChange: r.amount,
        cards: null,
        created_at: r.created_at,
        deposit: null,
        depositOld: null,
        interestAmount: null,
        interestAmountOld: null,
        interestPercentage: null,
        movementType: 'temp',
        notes: r.notes,
        paymentDocDate: null,
        requestType: r.type,
        updated_at: r.updated_at,
        userId: r.userId
      }
    }))
  }*/

  result.data.sort((a, b) => new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1)

  return preparePaginatedResult(result, sort, originalFilter)
}


