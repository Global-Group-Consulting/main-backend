const { castToObjectId } = require('../Helpers/ModelFormatters')

/**
 * @type {import('/@types/FilterMap').FilterMap}
 */
module.exports = {
  name: {
    query: value => ({ $regex: value, $options: 'i' })
  },
  categoryId: {
    query: value => (castToObjectId(value))
  },
  start: {
    query: (value) => ({ '$gte': new Date(value) })
  },
  end: {
    query: (value) => ({ '$lte': new Date((new Date(value)).setHours(23, 59, 59, 999)) })
  },
  userId: {
    key: () => 'userIds',
    query: value => (castToObjectId(value))
  },
  clientId: {
    query: value => (castToObjectId(value))
  },
  place: {
    query: (value) => ({ $regex: value, $options: 'i' })
  },
  createdAt: {
    key: () => 'created_at',
    query: (value) => {
      if (!(value instanceof Array)) {
        value = [value]
      }
      
      // if length is 2, it's a range
      if (value.length === 2) {
        return {
          '$gte': new Date(new Date(value[0]).setUTCHours(0, 0, 0, 0)),
          '$lte': new Date(new Date(value[1]).setUTCHours(23, 59, 59, 999))
        }
      }
      
      return { '$gte': new Date(value[0]) }
    }
  }
}
