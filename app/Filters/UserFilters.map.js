const AccountStatuses = require('../../enums/AccountStatuses')
const { int } = require('consis/lib/cast')
const { castToObjectId } = require('../Helpers/ModelFormatters')

/**
 * @type {import('/@types/FilterMap').FilterMap}
 */
module.exports = {
  _id: {
    query: (value) => {
      if (typeof value === 'string') {
        return { $in: [value, castToObjectId(value)] }
      }
      
      return value
    }
  },
  name: {
    fields: ['firstName', 'lastName'],
    query: (value) => {
      return [
        { firstName: { $regex: value, $options: 'i' } },
        { lastName: { $regex: value, $options: 'i' } }
      ]
    },
    key: () => '$or'
  },
  email: {
    fields: ['email'],
    query: (value) => {
      return { $regex: value, $options: 'i' }
    }
  },
  role: {
    fields: ['role']
  },
  roles: {
    fields: ['roles']
  },
  contractStatus: {
    fields: ['contractStatus'],
    query: (value) => {
      let toReturn = ''
      
      switch (value) {
        case 'missing':
          // toReturn = !data.contractImported && !data.contractSignedAt
          toReturn = [
            { contractImported: { $exists: false } },
            { contractSignedAt: { $exists: false } }
          ]
          
          break
        case 'imported':
          // toReturn = { contractImported ?? false }
          toReturn = true
          
          break
        case 'pending':
          // toReturn = !data.contractImported && !data.contractSignedAt && data.account_status === AccountStatuses.VALIDATED
          toReturn = [
            { contractImported: { $exists: false } },
            { contractSignedAt: { $exists: false } },
            { account_status: AccountStatuses.VALIDATED }
          ]
          
          break
        case 'signed':
          // toReturn = !data.contractImported && !!data.contractSignedAt
          toReturn = [
            { contractImported: { $exists: false } },
            {
              $and: [
                { contractSignedAt: { $exists: true } },
                { contractSignedAt: { $type: 'date' } }
              ]
            }
          ]
          
          break
      }
      
      return toReturn
    },
    key: (key, value) => {
      let toReturn = ''
      
      switch (value) {
        case 'missing':
          toReturn = '$and'
          
          break
        case 'imported':
          toReturn = 'contractImported'
          
          break
        case 'pending':
          toReturn = '$and'
          
          break
        case 'signed':
          toReturn = '$and'
          
          break
      }
      
      return toReturn
    }
  },
  accountStatus: { key: () => 'account_status' },
  clubPack: { field: 'clubPack' },
  contractId: {
    query: (value) => [
      { 'contractNumber': value },
      { 'contractNumber': int(value) }
    ],
    key: () => '$or'
  },
  gold: {
    fields: ['gold']
  },
  suspended: {
    fields: ['suspended'],
    query: (value) => !value ? null : value
  },
  depositRange: {},
  referenceAgent: {
    key: () => 'referenceAgent',
    query: (value) => {
      return { $in: [value, castToObjectId(value)] }
    }
  }
  // (data: any, searchValue: RangeValue): boolean => rangeMoney(data.earnings.deposit, searchValue),
  /*  depositRange: (data: any, searchValue: RangeValue): boolean => rangeMoney(data.earnings.deposit, searchValue),
    interestRange: (data: any, searchValue: RangeValue): boolean => rangeMoney(data.earnings.interests, searchValue),*/
}
