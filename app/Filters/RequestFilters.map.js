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
    query: (value) => {
      let toReturn = value
      
      if (value === RequestTypes.VERSAMENTO_INIZIALE) {
        // alla fine -> {initialMovement: true}
        toReturn = true
      } else if (value === RequestTypes.VERSAMENTO) {
        // alla fine -> {$and : [{...}, {...}]}
        toReturn = [
          { type: value },
          {
            '$or': [
              { initialMovement: { $exists: false } },
              { initialMovement: false }
            ]
          }
        ]
      }
      
      return toReturn
    },
    key: (key, value) => {
      let toReturn = key
      
      if (value === RequestTypes.VERSAMENTO_INIZIALE) {
        // alla fine -> {initialMovement: true}
        toReturn = 'initialMovement'
      } else if (value === RequestTypes.VERSAMENTO) {
        // alla fine -> {$and : [{...}, {...}]}
        toReturn = '$and'
      }
      
      return toReturn
    }
  },
  amount: {
    query: (value) => {
      let toReturn = []
      
      const min = value.min
      const max = value.max
      
      if (min) {
        toReturn.push({ amount: { $gte: int(min) } })
      }
      
      if (max) {
        toReturn.push({ amount: { $lte: int(max) } })
      }
      
      return toReturn
    },
    key: () => '$and'
  },
  user: {},
  status: {
    query: (value) => {
      // When requesting RIFIUTATA, include also ANNULATA
      if (value === RequestStatus.RIFIUTATA) {
        return { $in: [RequestStatus.RIFIUTATA, RequestStatus.ANNULLATA] }
      }
      
      return value
    }
  },
  referenceAgent: { key: () => 'user.referenceAgent' },
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
  },
  completedAt: {
    query: (value) => {
      let toReturn = []
      
      const min = value[0]
      const max = value[1]
      
      if (min) {
        toReturn.push({ completed_at: { $gte: new Date(min) } })
      }
      
      if (max) {
        const maxDate = new Date(max)
        
        // set the time to 23:59:59 so that the day is included
        maxDate.setHours(23, 59, 59, 999)
        
        toReturn.push({ completed_at: { $lte: maxDate } })
      }
      
      return toReturn
    },
    key: () => '$and'
  },
  clubCardNumber: {},
  autoWithdrawlAll: {
    query: (value) => {
      if (!value) {
        return [
          { autoWithdrawlAll: { $exists: false } },
          { autoWithdrawlAll: { $eq: false } }
        ]
      }
      
      return value
    },
    key: (key, value) => {
      if (!value) {
        return '$or'
      }
      
      return key
    }
  }
}
