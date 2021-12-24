'use strict';

/** @typedef {import("/@types/Attachment").Attachment} Attachment */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Helpers = use('Helpers');
const Drive = use('Drive');
const Logger = use('Logger');

const fs = require("fs");
const { resolve, basename } = require("path");
const { existsSync, unlinkSync } = require("fs");
const tmp = require('tmp');
const { Readable } = require('stream');
const Logger = use("Logger");

const { Types: MongoTypes } = require("mongoose");
const { castToObjectId } = require("../Helpers/ModelFormatters");

const axios = require("axios");

class File extends Model {
  static get computed () {
    return ["id"];
  }

  static get hidden() {
    return ['tmpPath', 'headers']
  }

  static boot() {
    super.boot()
  }

  static async fetchFile(filePath) {
    try {
      const fileResp = await axios.get(filePath, {
        responseType: 'arraybuffer'
      })

      return fileResp.data
    } catch (er) {
      throw er
    }
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
      const fileId = new MongoTypes.ObjectId()
      let file = files[key]
      let readableStream

      if (typeof file === "string" && file.startsWith("http")) {
        readableStream = await this.fetchFile(file)

        // create a fake file
        file = {};
      } else {
        readableStream = file.stream;

        // when the file is parsed bu the "bodyParser", the stream is not readable,
        // so first must create a readable stream, so that the upload to aws can succeed.
        if (!readableStream.readable) {
          readableStream = fs.createReadStream(file.tmpPath);
        }
      }

      const fileUrl = await Drive.put(fileId.toString(), readableStream);

      const newFile = await File.create({
        _id: fileId,
        ...(file.toJSON ? file.toJSON() : file),
        fileUrl,
        userId,
        loadedBy,
        ...extraData
      });

      storedFiles.push(newFile);
    }

    return storedFiles;
  }

  /**
   *
   * @param storedFiles
   * @param reqFiles
   * @returns {Record<string, Attachment | Attachment[]>}
   */
  static getFilesAsObj (storedFiles, reqFiles) {
    return storedFiles.reduce((acc, curr) => {
      const file = {
        "id": curr._id,
        "fileName": curr.clientName,
        "size": curr.size,
        "mimetype": curr.type + "/" + curr.subtype,
      };

      const fieldName = curr.fieldName.replace("[]", "");
      const asArray = reqFiles[fieldName] instanceof Array;

      // if the section doesn't exist, creates it as an array
      // should be created as an array only if the incoming type was an array
      if (!acc[fieldName] && asArray) {
        acc[fieldName] = [];
      }

      if (asArray) {
        acc[fieldName].push(file);
      } else {
        acc[fieldName] = file;
      }

      return acc;
    }, {});
  }

  static async deleteAllWith (toDeleteIds, field = "_id") {
    if (!(toDeleteIds instanceof Array)) {
      toDeleteIds = [toDeleteIds];
    }

    const query = toDeleteIds.map(el => castToObjectId(el, true));
    const filesToRemove = await File.where({ [field]: { $in: query } }).fetch();
    const removedFiles = [];

    Logger.info("[FILE] Files will be removed" + JSON.stringify(query));

    if (!filesToRemove || filesToRemove.rows === 0) {
      return;
    }

    for (const file of filesToRemove.rows) {
      Logger.info("[FILE] Removing from S3 " + file._id.toString());
      await Drive.delete(file._id.toString());
      removedFiles.push(await file.delete());
    }

    Logger.info("[FILE] removedFiles" + JSON.stringify(removedFiles));
    return removedFiles;
  }

  user() {
    return this.belongsTo('App/Models/User', "userId", "_id")
  }

  getId({_id}) {
    return _id.toString()
  }

  setRequestId(value) {
    return castToObjectId(value)
  }

  setUserId(value) {
    return castToObjectId(value)
  }

  setLoadedBy(value) {
    return castToObjectId(value)
  }
}

module.exports = File
