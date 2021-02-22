'use strict'

/** @typedef {import("../../../../@types/Brite/Brite").Brite} Brite */

/** @type {typeof import("../../../Models/Brite")} */
const BriteModel = use("App/Models/Brite")
const moment = require("moment");
const BriteMovementTypes = require("../../../../enums/BriteMovementTypes")
const {castToObjectId} = require("../../../Helpers/ModelFormatters")

class BriteController {
  /**
   * @param {Adonis.Http.Request} request
   * @param {{}} params
   * @param {{}} auth
   * @returns {Promise<Model>}
   */
  async manualAdd({request, params, auth}) {
    const userId = params.id
    const currentUser = auth.user._id

    /** @type { import("../../../../@types/Brite/dto/brite.manualAdd").BriteManualAdd } */
    const data = request.all()

    return BriteModel.manualAdd({
      amountChange: data.amountChange,
      notes: data.notes,
      userId,
      created_by: currentUser
    });
  }

  /**
   * @param {{}} params
   * @returns {Promise<Model>}
   */
  async read({params}) {
    return BriteModel.where({userId: castToObjectId(params.id)})
      .sort({created_at: -1}).fetch()
  }

  async readUsers() {
    return BriteModel.getClubUsers()
  }

  /**
   * @param {{}} params
   * @returns {Promise<Model>}
   */
  async getBlocksData({params}) {
    const userId = params.id

    return BriteModel.getBlocksDataForUSer(userId)
  }
}

module.exports = BriteController
