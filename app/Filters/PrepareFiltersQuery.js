/**
 *
 * @param {{}} filters
 * @param {import('/@types/FilterMap').FilterMap} map
 * @return {{}}
 */
function prepareFiltersQuery (filters, map) {
  const query = {}
  
  Object.keys(filters).forEach((key) => {
    if (map[key]) {
      const keyQuery = map[key].query ? map[key].query(filters[key]) : filters[key]
      const keyName = map[key].key ? map[key].key(key, filters[key]) : key
      
      // if keyQuery is null, avoid adding it to the query
      if (keyQuery !== null) {
        if (query[keyName] instanceof Array) {
          const value = keyQuery instanceof Array ? keyQuery : [keyQuery]
          
          if (value.length > 0) {
            query[keyName].push(...value)
          }
        } else {
          // keyQuery could be an empty array, so we need to check if it's an array
          if (keyQuery instanceof Array && keyQuery.length === 0) {
            return
          }
          
          query[keyName] = keyQuery
        }
      }
    }
  })
  
  console.log('filtering by', JSON.stringify(query))
  
  return query
}

module.exports.prepareFiltersQuery = prepareFiltersQuery
