/**
 * @type {import('/@types/FilterMap').FilterMap}
 */
const { castToObjectId } = require('../Helpers/ModelFormatters')

module.exports = {
  user: {
    key: () => 'user._id',
    query: value => castToObjectId(value)
  },
  role: {
    key: () => 'user.role',
  }
}
