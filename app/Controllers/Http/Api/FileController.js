'use strict'

/**
 * @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse
 */

const File = use("App/Models/File")
const Drive = use('Drive')
const Helpers = use('Helpers')
const Config = use('Adonis/Src/Config')
const path = require("path")
const {Readable} = require('stream');

const {existsSync} = require("fs")
const fs = require("fs");
const Logger = use("Logger");
const FileException = use("App/Exceptions/FileException");

class FileController {
  /**
   * Save a Readable stream to local disk.
   * @private
   * @param {{}} file - Readable stream that will be saved.
   * @param {string} pathname - Pathname in the disk.
   * @return {Promise} If successful returns a WritableStream.
   */
  _saveStreamToFile(file, pathname) {
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(pathname);

      file.pipe(writer);

      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async _downloadFromLocal(file) {
    return file.tmpPath;
  }

  async _downloadFromS3(file) {
    const filePath = Helpers.tmpPath(``);
    const s3File = await Drive.getObject(file._id.toString())

    fs.mkdirSync(filePath, {recursive: true})

    const readableInstanceStream = new Readable({
      read() {
        this.push(s3File.Body);
        this.push(null);
      },
    });

    const pathname = `${filePath}/${file.clientName}`;

    console.log(filePath)

    await this._saveStreamToFile(readableInstanceStream, pathname);

    return pathname
  }

  async meta ({ params, response }) {
    const { id } = params;
    const dbFile = await File.find(id);

    if (!dbFile) {
      throw new FileException('File not found');
      // response.badRequest('File not found');
    }

    return dbFile;
  }

  async show ({ params, response }) {
    const meta = await this.meta({ params, response });

    const s3File = await Drive.getSignedUrl(meta._id.toString())

    response.redirect(s3File) ;
  }

  async download ({ params, response }) {
    const { id } = params;

    const dbFile = await File.find(id);

    //TODO:: Check if the user has the rights to download that file

    if (!dbFile) {
      return response.badRequest('File not found');
    }

    const driverIsLocal = Config.get("drive.default") === "local"
    let pathName

    try {
      if (driverIsLocal) {
        pathName = await this._downloadFromLocal(dbFile);
      } else {
        pathName = await this._downloadFromS3(dbFile);
      }
    } catch (er) {
      Logger.error(er);
      throw new FileException('File not found');
    }

    response.download(pathName)
  }

  /**
   *
   * @param {{params: {id: string}, response: AdonisHttpResponse}} param0
   */
  async delete({params, response}) {
    const { id } = params;

    const dbFile = await File.find(id);

    //TODO:: Check if the user has the rights to download that file

    if (!dbFile) {
      return response.badRequest('File not found');
    }

    await File.deleteAllWith(id);

    return response.ok();
  }

  async deleteBulk ({ request }) {
    const filesToDelete = request.input("filesToDelete");

    return File.deleteAllWith(filesToDelete);
  }

  // Only for testing purposes
  async upload ({ request, auth }) {
    const userId = auth.user._id;

    request.multipart.file('*', {}, async (file) => {
      const uploadedFile = await File.store({
        [file.fieldName]: file
      }, userId, userId);

    });

    await request.multipart.process()
  }
}

module.exports = FileController
