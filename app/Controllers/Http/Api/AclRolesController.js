'use strict'
/** @typedef {typeof import("../../../../@types/Acl/Roles").AclRolesModel} AclRolesModel */
/** @typedef {typeof import("../../../../@types/Acl/Roles").AclRole} AclRole */
/** @typedef {import("../../../../@types/Acl/dto/roles.read.dto").RolesReadDto} RolesReadDto */
/** @typedef {import("../../../../@types/Acl/dto/roles.create.dto").RolesCreateDto} RolesCreateDto


/** @type {typeof import("../../../../@types/Acl/Roles").AclRolesModel} */
const AclModel = use("App/Models/AclRolesModel")
const AclGenericException = require("../../../Exceptions/Acl/AclGenericException")


class AclRolesController {
  /**
   * @param {Adonis.Http.Request} request
   * @returns {Promise<AclRole>}
   */
  async create({request}) {
    /** @type {typeof RolesCreateDto} RolesCreateDto */
    const data = request.all()
    const roleExists = await AclModel.where({code: data.code}).first()

    if (roleExists) {
      throw new AclGenericException("Role already exists.")
    }

    return AclModel.create(data);
  }

  /**
   * @param {RolesReadDto} params
   * @returns {Promise<AclRole>}
   */
  async read({params}) {
    return AclModel.find(params.id)
  }

  /**
   * @returns {Promise<AclRole[]>}
   */
  async readAll() {
    /**
     * @type {VanillaSerializer}
     */
    const result = await AclModel.all()

    return result.toJSON();
  }

  /**
   * @param {RolesReadDto} params
   * @param {Adonis.Http.Request} request
   * @returns {Promise<AclRole>}
   */
  async update({params, request}) {
    /**
     * @type {AclRolesModel}
     */
    const existing = await AclModel.find(params.id)

    if (!existing) {
      throw new AclGenericException("Role doesn't exist")
    }

    existing.merge(request.all())
    await existing.save()

    return existing
  }

  /**
   * @param {RolesReadDto} params
   * @param {Adonis.Http.Response} response
   * @returns {Promise<void>}
   */
  async delete({params, response}) {
    /**
     * @type {AclPermissionsModel}
     */
    const existing = await AclModel.find(params.id)

    if (!existing) {
      throw new AclGenericException("Role doesn't exist")
    }

    await existing.delete()

    response.ok()
  }

}

module.exports = AclRolesController
