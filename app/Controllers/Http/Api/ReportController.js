'use strict'

const Movement = use('App/Models/Movement')
const Commission = use('App/Models/Commission')

class ReportController {

  async readWithdrawals({request, auth}) {
    const filters = request.input("filters");

    const data = await Movement.getReportsData({
      ...filters,
      type: "withdrawals"
    })

    return data
  }

  async readCommissions({request, auth}) {
    const filters = request.input("filters");

    const data = await Commission.getReportsData({
      ...filters,
      type: "commissions"
    })

    return data
  }
}

module.exports = ReportController
