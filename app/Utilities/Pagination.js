/**
 * @typedef {import('../../@types/pagination/PaginatedResult').PaginatedResult} PaginatedResult
 * @typedef {import('../../@types/pagination/PaginatedResult').PaginatedData} PaginatedData
 */

/**
 * Prepare the sorting object merging the sortBy and sortDesc arrays
 *
 * @param {import('/@types/HttpRequest').RequestPagination} requestPagination
 * @param {any} [defaultSort]
 */
module.exports.prepareSorting = function (requestPagination, defaultSort) {
  let sort = defaultSort ? defaultSort : {}
  
  // if a sort is required, overwrite the default one
  if (requestPagination.sortBy && requestPagination.sortBy.length > 0) {
    // reset the default sort
    sort = {}
    
    requestPagination.sortBy.forEach((sortKey, i) => {
      sort[sortKey] = 1
      
      if (requestPagination.sortDesc && requestPagination.sortDesc[i]) {
        sort[sortKey] = -1
      }
    })
  }
  
  return sort
}

/**
 *
 * @param {PaginatedData} result
 * @param sort
 * @param filters
 * @return {PaginatedResult|*}
 */
module.exports.preparePaginatedResult = function (result, sort, filters) {
  return {
    ...result,
    sortBy: Object.keys(sort),
    sortDesc: Object.values(sort).map((el) => el < 1),
    filter: filters
  }
}
