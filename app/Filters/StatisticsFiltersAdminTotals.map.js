const AccountStatuses = require('../../enums/AccountStatuses')
const { int } = require('consis/lib/cast')
const { castToObjectId } = require('../Helpers/ModelFormatters')
const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require('../../enums/RequestTypes')

const moment = require('moment')

/**
 * @type {import('/@types/FilterMap').FilterMap}
 */
module.exports = {
  dates: {
    query: (value) => {
      let toReturn = []
      
      if (!value || !value.length) {
        return toReturn
      }
      
      let min = value[0]
      let max = value[1]
      
      // avoid inverted dates
      if (min && max) {
        if (min > max) {
          [min, max] = [max, min]
        }
      }
      
      if (min) {
        const minDate = moment(min).date(16).startOf("day").toDate()
        
        toReturn.push({ created_at: { $gte: minDate } })
      }
      
      if (max) {
        const maxDate = moment(max).add(1, "month").date(15).endOf("day").toDate()
        
        toReturn.push({ created_at: { $lte: maxDate } })
      }
      
      return toReturn
    },
    key: () => '$and'
  },
  userId: {
    // key: () => 'userId',
    query: (value) => {
      return castToObjectId(value)
    }
  },
  fromClub: {}
}
