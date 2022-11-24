'use strict'

const { WhitelistValidator } = require('../../WhitelistValidator')

class StatisticsMovementsRefreshRequest extends WhitelistValidator{
  get rules () {
    return {
      userId: 'required|objectId',
      dates: 'required|array|min:2'
    }
  }
}

module.exports = StatisticsMovementsRefreshRequest
