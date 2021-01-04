const {values} = require("lodash")
const {Types: MongoTypes} = require("mongoose")
const moment = require("moment")

const writtenNumber = require('written-number');

exports.castToObjectId = function (value) {
  if (!value) {
    return value
  }

  if (value instanceof Array) {
    return value.map(_val => new MongoTypes.ObjectId(_val))
  } else if (typeof value === "string") {
    return new MongoTypes.ObjectId(value)
  }

  return value
}

exports.castToNumber = function (value) {
  if (typeof value === "string") {
    return +value
  }

  return value
}

exports.castToIsoDate = function (value) {
  if (!value) {
    return value
  }

  const castedDate = moment(value, true)

  if (!castedDate.isValid()) {
    return value
  }

  return castedDate.toDate()
}

exports.castToBoolean = function (value) {
  let boolVal = false

  if (typeof value === "boolean") {
    boolVal = value
  }

  if (typeof value === "number") {
    boolVal = value === 1
  }

  if (typeof value === "string") {
    boolVal = value.toLowerCase() === "true"
  }

  return boolVal
}

exports.formatDate = function (value, includeHours = false, formatString) {
  if (!value) {
    return value
  }
  const momentInstance = moment(value)

  momentInstance.locale("it")

  return momentInstance.format((formatString || "L") + (includeHours ? " LT" : ""))
}

exports.formatWrittenNumbers = function (value) {
  if (!value) {
    return value
  }

  return writtenNumber(+value, {lang: "it"})
}

exports.formatContractNumber = function (value) {
  if (!value) {
    return value
  }

  let finalValue = value.toString()

  while (finalValue.length < 6) {
    finalValue = '0' + finalValue
  }

  return finalValue
}

exports.formatMoney = function (value) {
  if (!value) {
    return value
  }

  let num = new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'}).format(value);

  return num
}

exports.formatResidencePlace = function (user) {
  return `${user.legalRepresentativeAddress} - ${user.legalRepresentativeZip} ${user.legalRepresentativeCity} (${user.legalRepresentativeProvince})`
}

exports.formatBirthPlace = function (user) {
  let province = user.birthProvince || user.birthCountry

  return `${user.birthCity} (${province})`
}
