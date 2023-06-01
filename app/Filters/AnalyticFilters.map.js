/**
 * @type {import('/@types/FilterMap').FilterMap}
 */
const { castToObjectId, castToIsoDate } = require('../Helpers/ModelFormatters')
const moment = require('moment-timezone')
const { Date: D } = require('mongoose')

module.exports = {
  user: {
    key: () => 'user._id',
    query: value => castToObjectId(value)
  },
  role: {
    key: () => 'user.role'
  },
  day: {
    key: () => 'day',
    query: value => {
      return { '$gte': castToIsoDate(value), $lte: castToIsoDate(moment(value).endOf('day'))}
    }
  }
}
