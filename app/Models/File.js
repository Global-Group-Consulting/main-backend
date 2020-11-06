'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Helpers = use('Helpers')

const fs = require("fs")
const { resolve, basename } = require("path")

class File extends Model {

  /**
   *
   * @param {{[key:string]: File}} files
   * @param {string} userId
   */
  static async store(files, userId, loadedBy) {
    for (const key of Object.keys(files)) {
      const file = files[key]

      await file.move(resolve(__dirname, "../../_fileSystem"), {
        name: basename(file.tmpPath, ".tmp")
      })

      if (!file.moved()) {
        return file.error()
      }

      await File.create({
        ...file.toJSON(),
        userId,
        loadedBy
      })
    }
  }

  static get hidden() {
    return ['tmpPath', 'headers']
  }


  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = File
