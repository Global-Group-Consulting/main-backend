'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Helpers = use('Helpers')

const fs = require("fs")
const { resolve, basename } = require("path")
const { existsSync, unlinkSync } = require("fs")


class File extends Model {

  static boot() {
    super.boot()

    this.addHook('afterDelete', async (file) => {
      const filePath = this._getFilePath(file)

      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
    })
  }

  /**
   *
   * @param {{[key:string]: File}} files
   * @param {string} userId // user id
   * @param {string} loadedBy // loaded by id
   */
  static async store(files, userId, loadedBy, extraData = {}) {
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
        loadedBy,
        ...extraData
      })
    }
  }

  static async remove(field, value) {
    const files = await File.where({ [field]: value }).delete()

    return files
  }

  static get hidden() {
    return ['tmpPath', 'headers']
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = File
