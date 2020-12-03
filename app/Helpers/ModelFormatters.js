const { values } = require("lodash")
const { Types: MongoTypes } = require("mongoose")
const moment = require("moment")

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