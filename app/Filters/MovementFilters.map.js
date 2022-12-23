const AccountStatuses = require('../../enums/AccountStatuses')
const { int } = require('consis/lib/cast')
const { castToObjectId } = require('../Helpers/ModelFormatters')
const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require('../../enums/RequestTypes')

/**
 * @type {import('/@types/FilterMap').FilterMap}
 */
module.exports = {
  type: {
    // query: (value) => {},
    key: (key, value) => 'movementType'
  },
  userId: {},
  amount: {
    query: (value) => {
      let toReturn = []
      
      const min = value.min
      const max = value.max
      
      if (min) {
        toReturn.push({ amountChange: { $gte: int(min) } })
      }
      
      if (max) {
        toReturn.push({ amountChange: { $lte: int(max) } })
      }
      
      return toReturn
    },
    key: () => '$and'
  },
  createdAt: {
    query: (value) => {
      let toReturn = []
      
      const min = value[0]
      const max = value[1]
      
      if (min) {
        toReturn.push({ created_at: { $gte: new Date(min) } })
      }
      
      if (max) {
        const maxDate = new Date(max)
        
        // set the time to 23:59:59 so that the day is included
        maxDate.setHours(23, 59, 59, 999)
        
        toReturn.push({ created_at: { $lte: maxDate } })
      }
      
      return toReturn
    },
    key: () => '$and'
  }
}
