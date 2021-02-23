'use strict'

const AclRolesModel = use("App/Models/AclRolesModel")
const UsersModel = use("App/Models/User")
const AclHook = exports = module.exports = {}
const moment = require("moment");

AclHook.afterDelete = async (modelInstance) => {
  await AclRolesModel.query()
    .where({permissions: modelInstance.code})
    .update({$pull: {permissions: modelInstance.code}});

  await UsersModel.query()
    .where({directPermissions: modelInstance.code})
    .update({$pull: {directPermissions: modelInstance.code}});
}
