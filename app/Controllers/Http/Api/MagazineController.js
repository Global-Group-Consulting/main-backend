'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('../../../../@types/Magazine').FormMagazineCreate} FormMagazineCreate */
/** @typedef {import('../../../../@types/Magazine').FormMagazineFilesCreate} FormMagazineFilesCreate */
/** @typedef {import('../../../../@types/Magazine').IMagazine} IMagazine */

const Magazine = use("App/Models/Magazine")
const File = use('App/Models/File')
const moment = require("moment")

/**
 * Resourceful controller for interacting with magazines
 */
class MagazineController {
  /**
   * Show a list of all magazines.
   * GET magazines
   */
  async index() {
    return Magazine.sort({showFrom: -1, showUntil: -1, publicationDate: -1}).fetch()
  }

  /**
   * Get the current active magazine
   * GET magazines
   */
  async current() {
    return Magazine
      .with("coverFile")
      .sort({showFrom: -1, showUntil: -1, publicationDate: -1})
      .first()
  }


  /**
   * Create/save a new magazine.
   * POST magazines
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({request, response, auth}) {
    /** @type {FormMagazineCreate} */
    const formData = request.all();

    /** @type {IMagazine && Model} */
    const newMagazine = new Magazine();

    newMagazine.title = formData.title
    newMagazine.publicationDate = formData.publicationDate
    newMagazine.showFrom = formData.showRange[0]
    newMagazine.showUntil = formData.showRange[1]

    /** @type {FormMagazineFilesCreate} */
    const files = request.files()

    /** @type {[]} */
    const uploadedFile = await File.store(files, null, auth.user._id)

    newMagazine.fileId = uploadedFile.find(file => file.fieldName === "pdfFile")._id
    newMagazine.coverFileId = uploadedFile.find(file => file.fieldName === "coverFile")._id

    await newMagazine.save()

    return newMagazine
  }

  /**
   * Display a single magazine.
   * GET magazines/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({params, request, response, view}) {
    const magazineId = params.id

    /** @type {IMagazine && Model} */
    const magazine = await Magazine.find(magazineId);

    if (!magazine) {
      return response.badRequest("Can't find the requested magazine.")
    }

    magazine.file = await File.find(magazine.fileId);
    magazine.coverFile = await File.find(magazine.coverFileId);

    return magazine;
  }

  /**
   * Update magazine details.
   * PUT or PATCH magazines/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({params, request, response, auth}) {
    /** @type {FormMagazineCreate} */
    const formData = request.all();

    /** @type {IMagazine && Model} */
    const magazine = await Magazine.find(params.id);

    if (!magazine) {
      return response.badRequest("Can't find the requested magazine.")
    }

    /** @type {FormMagazineFilesCreate} */
    const files = request.files()

    magazine.title = formData.title
    magazine.publicationDate = formData.publicationDate
    magazine.showFrom = formData.showRange[0]
    magazine.showUntil = formData.showRange[1]

    if (Object.keys(files).length > 0) {
      /** @type {[]} */
      const uploadedFile = await File.store(files, null, auth.user._id)

      const pdfFile = uploadedFile.find(file => file.fieldName === "pdfFile")
      const coverFile = uploadedFile.find(file => file.fieldName === "coverFile")

      if (pdfFile) {
        await File.deleteAllWith(magazine.fileId.toString());

        magazine.fileId = pdfFile._id;
      }

      if (coverFile) {
        await File.deleteAllWith(magazine.coverFileId.toString());

        magazine.coverFileId = coverFile._id;
      }
    }

    await magazine.save()

    return magazine
  }

  /**
   * Delete a magazine with id.
   * DELETE magazines/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({params, request, response}) {
    const magazineId = params.id

    /** @type {IMagazine && Model} */
    const magazine = await Magazine.find(magazineId);

    if (!magazine) {
      return response.badRequest("Can't find the requested magazine.")
    }

    (magazine.fileId && await File.deleteAllWith(magazine.fileId.toString()));
    (magazine.coverFileId && await File.deleteAllWith(magazine.coverFileId.toString()));

    magazine.delete();

    return;
  }
}

module.exports = MagazineController
