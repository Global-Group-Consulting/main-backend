'use strict'
/** @typedef {typeof import("../../../../@types/Acl/Permissions").AclPermissionsModel} AclPermissionsModel */
/** @typedef {typeof import("../../../../@types/Acl/Permissions").AclPermission} AclPermission */
/** @typedef {import("../../../../@types/Acl/dto/permissions.read.dto").PermissionsReadDto} PermissionsReadDto */
/** @typedef {import("../../../../@types/Acl/dto/permissions.create.dto").PermissionsCreateDto} PermissionsCreateDto

 /** @type {typeof import("../../../../@types/Acl/Permissions").AclPermissionsModel} */
const AclModel = use("App/Models/AclPermissionsModel")
const AclGenericException = require("../../../Exceptions/Acl/AclGenericException")

class AclPermissionsController {
  /**
   * @param {Adonis.Http.Request} request
   * @returns {Promise<AclPermission>}
   */
  async create({request}) {
    /** @type {typeof PermissionsCreateDto} PermissionsCreateDto */
    const data = request.all()
    const permissionExists = await AclModel.where({code: data.code}).first()

    if (permissionExists) {
      throw new AclGenericException("Permission already exists.")
    }

    return AclModel.create(data);
  }

  /**
   * @param {PermissionsReadDto} params
   * @returns {Promise<AclPermission>}
   */
  async read({params}) {
    return AclModel.find(params.id)
  }

  /**
   * @returns {Promise<AclPermission[]>}
   */
  async readAll() {
    /**
     * @type {VanillaSerializer}
     */
    const result = await AclModel.all()

    return result.toJSON();
  }

  /**
   * @param {PermissionsReadDto} params
   * @param {Adonis.Http.Request} request
   * @returns {Promise<AclPermission>}
   */
  async update({params, request}) {
    /**
     * @type {AclPermissionsModel}
     */
    const existing = await AclModel.find(params.id)

    if (!existing) {
      throw new AclGenericException("Permission doesn't exist")
    }

    existing.merge(request.all())
    await existing.save()

    return existing
  }

  /**
   * @param {PermissionsReadDto} params
   * @param {Adonis.Http.Response} response
   * @returns {Promise<AclPermission>}
   */
  async delete({params, response}) {
    /**
     * @type {AclPermissionsModel}
     */
    const existing = await AclModel.find(params.id)

    if (!existing) {
      throw new AclGenericException("Permission doesn't exist")
    }

    await existing.delete()

    response.ok()
  }

}

module.exports = AclPermissionsController
