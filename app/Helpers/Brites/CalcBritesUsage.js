const moment = require("moment");

/**
 * @param {string} semesterString
 * @returns {{semesterId: string, usableFrom: Moment, expiresAt: Moment}}
 */
exports.calcBritesUsage = function (semesterString) {
  const semesterData = semesterString.split("_")
  const semesterYear = +semesterData[0]
  const semesterId = +semesterData[1]

  const usableFrom = moment()
    .set({
      date: 1,
      month: semesterId === 1 ? 6 : 0,
      year: semesterId === 1 ? semesterYear : semesterYear + 1
    })
    .startOf("day")

  const expiresAt = moment(usableFrom)
    .add(1, "year")
    .endOf("day")

  return {
    semesterId: semesterString,
    usableFrom,
    expiresAt
  }
}
