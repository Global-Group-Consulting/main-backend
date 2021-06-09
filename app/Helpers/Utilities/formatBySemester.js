const moment = require('moment');
const {get} = require('lodash')

/**
 *
 * @param data
 * @param field
 * @param {{field: string}} [sum]
 * @returns {{last12Months: number, last3Months: number, last6Months: number, thisMonth: number}}
 */
exports.formatBySemester = function (data, field, sum) {

  const dataToReturn = {
    thisMonth: 0,
    last3Months: 0,
    last6Months: 0,
    last12Months: 0,
  }

  const currMonth = moment().startOf("month")
  const semesters = {
    thisMonth: currMonth,
    last3Months: moment(currMonth).subtract(3, "months"),
    last6Months: moment(currMonth).subtract(6, "months"),
    last12Months: moment(currMonth).subtract(12, "months"),
  }

  for (let entry of data) {
    /**
     * @type {string}
     */
    const activationDate = get(entry, field);

    const isThisMonth = moment(activationDate).isBetween(semesters.thisMonth, moment());
    const last3Months = moment(activationDate).isBetween(semesters.last3Months, moment());
    const last6Months = moment(activationDate).isBetween(semesters.last6Months, moment());
    const last12Months = moment(activationDate).isBetween(semesters.last12Months, moment());

    (isThisMonth && (dataToReturn.thisMonth += (sum ? +entry[sum.field] : 1)));
    (last3Months && (dataToReturn.last3Months += (sum ? +entry[sum.field] : 1)));
    (last6Months && (dataToReturn.last6Months += (sum ? +entry[sum.field] : 1)));
    (last12Months && (dataToReturn.last12Months += (sum ? +entry[sum.field] : 1)));
  }

  return dataToReturn
}
