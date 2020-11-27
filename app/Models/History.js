'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Differify = require("@netilon/differify")

/** @type {import("@netilon/differify").Differify} */
const differify = new Differify({ mode: { object: "DIFF" } })

class History extends Model {

  static async addChanges(model, newData) {
    // first get current user data.
    let oldData = await model.find(newData.id)

    if (!oldData) {
      oldData = {}
      // indicates a new entry in the db.
    }

    // get data differences
    const differences = differify.compare(oldData.toJSON ? oldData.toJSON() : oldData,
      newData.toJSON ? newData.toJSON() : newData)

    if (differences.status === "MODIFIED") {
      // create a new entry in history
      this.create({
        model: model.name,
        changedBy: newData.lastChangedBy,
        differences
      })
    }
  }
}

module.exports = History
