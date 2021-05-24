'use strict'

const SettingsProvider = use("SettingsProvider")

/** @type {import("../../../Models/Setting")} */
const SettingModel = use("App/Models/Setting")
/** @type {import("../../../../@types/Acl/AclProvider").AclProvider} */
const AclProvider = use('AclProvider')

const SettingTypes = require("../../../../enums/SettingTypes");
const AclGenericException = require("../../../Exceptions/Acl/AclGenericException")
const AclForbiddenException = require("../../../Exceptions/Acl/AclForbiddenException")
const {SettingPermissions} = require("../../../Helpers/Acl/enums/setting.permissions");

class SettingController {
  async readAll({auth}) {
    // Check user permissions
    // This settings must be always available
    /*if (!(await AclProvider.checkPermissions([SettingPermissions.SETTINGS_ALL_READ], auth))) {
      throw new AclForbiddenException()
    }*/

    return SettingModel.readAll()
  }

  async readForUser({params, auth}) {
    const userId = params.id

    // Check user permissions
    // and check if the logged user is the same as the required userId
    if (!(await AclProvider.checkPermissions([SettingPermissions.SETTINGS_SELF_READ], auth))
      && userId === auth.user._id.toString()) {
      throw new AclForbiddenException()
    }

    return SettingModel.readAll(userId)
  }

  async upsertAll({request, auth}) {
    /**
     * @type {any[]}
     */
    const data = request.all()

    // Check user permissions
    if (!(await AclProvider.checkPermissions([SettingPermissions.SETTINGS_ALL_WRITE], auth))) {
      throw new AclForbiddenException()
    }

    for (let key in data) {
      const dataToSave = data[key];

      dataToSave.userId = undefined;
      dataToSave.type = SettingTypes.GLOBAL;

      await SettingModel.upsert(dataToSave)
    }

    const globalSettings = await SettingModel.readAll()

    // Updates settings that are stored inside the provider
    SettingsProvider.storeSettings(globalSettings)

    return globalSettings
  }

  async upsertForUser({request, params, auth}) {
    const userId = params.id
    const data = request.all()

    // Check user permissions
    // and check if the logged user is the same as the required userId
    if (!(await AclProvider.checkPermissions([SettingPermissions.SETTINGS_SELF_WRITE], auth))
      && userId === auth.user._id.toString()) {
      throw new AclForbiddenException()
    }

    data.userId = userId;
    data.type = SettingTypes.USER;

    return SettingModel.upsert(data)
  }
}

module.exports = SettingController
