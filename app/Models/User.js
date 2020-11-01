'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const ContractCounter = use('App/Controllers/Http/CountersController')

const UserRoles = require("../../enums/UserRoles")
const PersonTypes = require("../../enums/PersonTypes")
const AccountStatuses = require("../../enums/AccountStatuses")

class User extends Model {
  static userFields = {
    'personType': '',
    'businessName': '',
    'vatNumber': '',
    'firstName': '',
    'lastName': '',
    'fiscalCode': '',
    'gender': '',
    'birthCountry': '',
    'birthProvince': '',
    'birthCity': '',
    'birthDate': '',
    'docType': '',
    'docNumber': '',
    'docExpiration': '',
    'businessCountry': '',
    'businessRegion': '',
    'businessProvince': '',
    'businessCity': '',
    'businessZip': '',
    'businessAddress': '',
    'legalRepresentativeCountry': '',
    'legalRepresentativeRegion': '',
    'legalRepresentativeProvince': '',
    'legalRepresentativeCity': '',
    'legalRepresentativeZip': '',
    'legalRepresentativeAddress': '',
    'email': '',
    'mobile': '',
    'phone': '',
    'contractNumber': '',
    'contractDate': '',
    'contractPercentage': '',
    'contractIban': '',
    'contractBic': '',
    'role': '',
    'referenceAgent': '',
    'created_at': '',
    'updated_at': '',
    'activated_at': '',
    'verified_at': '',
    'account_status': ''
  }

  static get allUserFields() {
    return Object.keys(User.userFields)
  }

  static get updatableFields() {
    const avoidFields = ['contractNumber', 'contractDate', 'id', 'created_at',
      'updated_at', 'activated_at', 'verified_at', 'account_status']
    const fields = Object.keys(User.userFields)

    return fields.reduce((acc, field) => {
      if (!avoidFields.includes(field)) {
        acc.push(field)
      }

      return acc
    }, [])
  }

  static boot() {
    super.boot()

    this.addHook('beforeCreate', async (userData) => {
      userData.role = userData.role || UserRoles.CLIENTE
      userData.personType = userData.personType || PersonTypes.FISICA

      if (!userData.account_status) {
        // If the account type is admin or serv cliente, skip the normal user procedure
        if ([UserRoles.ADMIN || UserRoles.SERV_CLIENTI].includes(userData.role)) {
          userData.account_status = AccountStatuses.APPROVED
        }
      }

      userData.contractNumber = await (new ContractCounter()).incrementContract()
    })

    this.addHook("afterCreate", async (userDat) => {
      userDat.id = userDat._id.toString()
    })

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      userInstance.id && (delete userInstance.id)

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    this.addHook('afterFind', async (userInstance) => {
      userInstance.id = userInstance._id
    })
    this.addHook('afterFetch', async (userInstances) => {
      userInstances.map(inst => inst.id = inst._id)
    })
  }

  /**
   * Hides the fields in the array that returns
   */
  static get hidden() {
    return ['password', '_id', '__v']
  }

  /**
   * A relationship on tokens is required for Auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  apiTokens() {
    return this.hasMany('App/Model/Token')
  }

  get_id(value) {
    return value.toString()
  }
}

module.exports = User
