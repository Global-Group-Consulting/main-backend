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
    query: (value) => ({ '$lte': new Date(value) })
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
  }
}
