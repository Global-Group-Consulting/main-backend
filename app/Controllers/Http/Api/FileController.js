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
    const { id } = params

    const file = await File.find(id)
    const filePath = file.getFilePath()
    const isExist = await existsSync(filePath);

    if (isExist) {
      return response.download(filePath, file.clientName);
    }
    return response.badRequest('File not found');
  }

  /**
   *
   * @param {{params: any, response: AdonisHttpResponse}} param0
   */
  async delete({ params, response }) {
    const { id } = params

    const file = await File.find(id)

    if (!file) {
      return response.badRequest("File not found")
    }

    await file.delete()

    return response.ok()
  }
}

module.exports = FileController
