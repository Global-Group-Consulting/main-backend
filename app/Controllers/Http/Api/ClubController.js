/** @type {typeof import("../../../Models/Brite")} */
const BriteModel = use("App/Models/Brite")

class ClubController {

  /**
   * Statistics for the entire club that will show brites for each semester,
   * for all club users
   *
   * @return {Promise<void>}
   */
  async dashboardSemesters({auth}) {
    return await BriteModel.getDashboardStatistics();
  }
}

module.exports = ClubController
