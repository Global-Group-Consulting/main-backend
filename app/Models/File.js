'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Helpers = use('Helpers')
const Drive = use('Drive')

const fs = require("fs")
const {resolve, basename} = require("path")
const {existsSync, unlinkSync} = require("fs")

const {Types: MongoTypes} = require("mongoose")
const {castToObjectId} = require("../Helpers/ModelFormatters")

class File extends Model {
  static get computed() {
    return ["id"]
  }

  static get hidden() {
    return ['tmpPath', 'headers']
  }

  static boot() {
    super.boot()
  }

  /**
   *
   * @param {{ [key:string]: File }} files
   * @param {string} userId // user id
   * @param {string} loadedBy // loaded by id
   * @returns {Promise<Model[]>}
   */
  static async store(files, userId, loadedBy, extraData = {}) {
    const storedFiles = []

    for (const key of Object.keys(files)) {
      const file = files[key]
      const fileId = new MongoTypes.ObjectId()

      let readableStream = file.stream

      // when the file is parsed bu the "bodyParser", the stream is not readable,
      // so first must create a readable stream, so that the upload to aws can succeed.
      if (!file.stream.readable) {
        readableStream = fs.createReadStream(file.tmpPath)
      }

      const fileUrl = await Drive.put(fileId.toString(), readableStream)

      const newFile = await File.create({
        _id: fileId,
        ...file.toJSON(),
        fileUrl,
        userId,
        loadedBy,
        ...extraData
      })

      storedFiles.push(newFile)
    }

    return storedFiles
  }


  static async deleteAllWith(value, field = "_id") {
    const filesToRemove = await File.where({[field]: castToObjectId(value)}).fetch()
    const removedFiles = []

    if (!filesToRemove) {
      return
    }

    for (const file of filesToRemove.rows) {
      await Drive.delete(value)
      removedFiles.push(await file.delete())
    }

    return removedFiles
  }

  getId({_id}) {
    return _id.toString()
  }

  user() {
    return this.belongsTo('App/Models/User', "userId", "_id")
  }
}

module.exports = File
