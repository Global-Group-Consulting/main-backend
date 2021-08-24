'use strict'

/** @typedef {import("../../../../@types/Brite/Brite").Brite} Brite */

/** @type {typeof import("../../../Models/Brite")} */
const BriteModel = use("App/Models/Brite")
const UserModel = use("App/Models/User")
const AclRolesModel = use("App/Models/AclRolesModel")
const CommunicationController = use("App/Controllers/Http/Api/CommunicationController")
const moment = require("moment");
const BriteMovementTypes = require("../../../../enums/BriteMovementTypes")
const {castToObjectId} = require("../../../Helpers/ModelFormatters")

const MessageTypes = require("../../../../enums/MessageTypes")

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
      semesterId: data.semester,
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
   * @param {Adonis.Http.Request} request
   * @param {{}} auth
   * @returns {Promise<Model>}
   */
  async use({request, auth, params}) {
    const data = request.all()
    const user = await UserModel.find(params.id)

    const briteMovement = await BriteModel.useRequest({
      amountChange: data.amountChange,
      notes: data.notes,
      userId,
      created_by: params.id
    });

    const communicationData = {
      "type": MessageTypes.BRITE_USE,
      "subject": "Richiesta utilizzo brite",
      "content": `L'utente <strong>${user.firstName} ${user.lastName}</strong> richiede l'utilizzo di ${data.amount} Brite, con la seguente motivazione:<br> ${data.notes}`,
      "receiver": await this.getClubRequestReceivers()
    }

    request.body = communicationData

    await CommunicationController.prototype.create({request, auth})
  }

  /**
   * @param {Adonis.Http.Request} request
   * @param {{}} auth
   * @returns {Promise<Model>}
   */
  async remove({request, auth, params}) {
    const userId = params.id
    const currentUser = auth.user._id

    /** @type { import("../../../../@types/Brite/dto/brite.manualAdd").BriteManualAdd } */
    const data = request.all()

    return BriteModel.manualRemove({
      amountChange: data.amountChange,
      notes: data.notes,
      userId,
      created_by: currentUser,
      semesterId: data.semesterId
    });
  }

  /**
   * @param {{}} params
   * @returns {Promise<Model>}
   */
  async getBlocksData({params}) {
    const userId = params.id

    return BriteModel.getBlocksDataForUSer(userId)
  }

  async getClubRequestReceivers() {
    const rolesWithPermissions = await AclRolesModel.where({"permissions": {$in: ["club:approve", "club:*"]}}).fetch()

    const validRoles = rolesWithPermissions.toJSON().reduce((acc, curr) => {
      acc.push(curr.code)

      return acc
    }, [])
    const users = await UserModel.where({roles: {$in: validRoles}}).fetch()

    return users.toJSON().reduce((acc, curr) => {
      acc.push(curr.id)

      return acc
    }, [])
  }
}

module.exports = BriteController
