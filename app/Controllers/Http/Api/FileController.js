'use strict'

/**
 * @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse
 */

const File = use("App/Models/File")
const Drive = use('Drive')
const Helpers = use('Helpers')
const path = require("path")
const {Readable} = require('stream');

const {existsSync} = require("fs")
const fs = require("fs")

class FileController {
  /**
   * Save a Readable stream to local disk.
   * @private
   * @param {Readable} file - Readable stream that will be saved.
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

  async download({params, response}) {
    const {id} = params

    const dbFile = await File.find(id)

    //TODO:: Check if the user has the rights to download that file

    if (!dbFile) {
      return response.badRequest('File not found');
    }

    const path = Helpers.tmpPath(``);
    const file = await Drive.getObject(id)

    const readableInstanceStream = new Readable({
      read() {
        this.push(file.Body);
        this.push(null);
      },
    });

    const pathname = `${path}/${dbFile.clientName}`;

    await this._saveStreamToFile(readableInstanceStream, pathname);

    /*response.response.writeHead(200, {
      'Content-Type': dbFile.type + "/" + dbFile.subtype,
      'Content-Disposition': 'inline; filename="' + dbFile.clientName + '"'
    })*/

    response.download(pathname)
  }

  /**
   *
   * @param {{params: {id: string}, response: AdonisHttpResponse}} param0
   */
  async delete({ params, response }) {
    const {id} = params

    const dbFile = await File.find(id)

    //TODO:: Check if the user has the rights to download that file

    if (!dbFile) {
      return response.badRequest('File not found');
    }

    await File.deleteAllWith(id)

    return response.ok()
  }

  // Only for testing purposes
  async upload({request, auth}) {
    const userId = auth.user._id

    request.multipart.file('*', {}, async (file) => {
      const uploadedFile = await File.store({
        [file.fieldName]: file
      }, userId, userId)

    })

    await request.multipart.process()
  }
}

module.exports = FileController
