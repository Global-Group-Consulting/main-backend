'use strict'

/**
 * @typedef {import("../../../../@types/HttpResponse").AdonisHttpResponse} AdonisHttpResponse
 */

const File = use("App/Models/File")
const Drive = use('Drive')
const Helpers = use('Helpers')
const path = require("path")

const { existsSync } = require("fs")

class FileController {
  async download({ params, response }) {
    const {id} = params

    const dbFile = await File.find(id)

    //TODO:: Check if the user has the rights to download that file

    if (!dbFile) {
      return response.badRequest('File not found');
    }

    const file = await Drive.getStream(id)

    response.response.writeHead(200, {
      'Content-Type': dbFile.headers["content-type"],
      'Content-Disposition': 'inline; filename="' + dbFile.clientName + '"'
    })

    file.pipe(response.response, {end: true})
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
