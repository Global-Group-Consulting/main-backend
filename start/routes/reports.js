const {setAclMiddleware} = require("../../app/Helpers/Acl");
const {ReportsPermissions} = require("../../app/Helpers/Acl/enums/reports.permissions");

module.exports = function (Route) {
  Route.group(() => {
    Route.post('/withdrawals', 'ReportController.readWithdrawals')
    Route.post('/commissions', 'ReportController.readCommissions')
  }).prefix('/api/reports')
    .middleware('auth', setAclMiddleware(ReportsPermissions.REPORTS_READ))
    .namespace('Api')
}
