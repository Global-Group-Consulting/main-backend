'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')
const UserNotFoundException = use('App/Exceptions/UserNotFoundException')


const ContractCounter = use('App/Controllers/Http/CountersController')

const UserRoles = require("../../enums/UserRoles")
const PersonTypes = require("../../enums/PersonTypes")
const AccountStatuses = require("../../enums/AccountStatuses")

const { groupBy: _groupBy } = require("lodash")

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
    'contractInitialInvestment': 0,
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

  static async includeFiles(data) {
    data.files = await File.where({ userId: data.id }).fetch()
  }

  static boot() {
    super.boot()

    this.addHook('beforeCreate', async (userData) => {
      userData.role = userData.role || UserRoles.CLIENTE
      userData.personType = userData.personType || PersonTypes.FISICA

      userData.files = null

      /* if (!userData.account_status) {
        // If the account type is admin or serv cliente, skip the normal user procedure
        if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userData.role)) {
          userData.account_status = AccountStatuses.APPROVED
        }
      } */

      userData.contractNumber = await (new ContractCounter()).incrementContract()
    })

    this.addHook("afterCreate", async (userData) => {
      userData.id = userData._id.toString()
      await this.includeFiles(userData)
    })

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      userInstance.id && (delete userInstance.id)

      userInstance.files = null

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    this.addHook('afterSave', async (userData) => {
      await this.includeFiles(userData)
    })

    this.addHook('afterFind', async (userInstance) => {
      userInstance.id = userInstance._id

      await this.includeFiles(userInstance)
    })
    this.addHook('afterFetch', async (userInstances) => {
      userInstances.map(inst => inst.id = inst._id)
    })
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   */
  static async checkExists(key, value) {
    const result = await User.findBy(key, value)

    if (!result) {
      throw new UserNotFoundException()
    }
  }

  static async groupByRole(filter = {}, returnFlat = false) {
    const data = await this.where({ ...filter })
      .sort({ firstName: 1, lastName: 1 })
      .fetch()

    if (returnFlat) {
      return data.rows || []
    }

    const groupedData = _groupBy(data.rows, (value) => value.role)

    return Object.keys(groupedData).reduce((acc, key) => {
      acc.push({
        id: key.toString(),
        data: groupedData[key]
      })

      return acc
    }, [])
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

  files() {
    return this.hasMany('App/Models/File')
  }

  apiTokens() {
    return this.hasMany('App/Model/Token')
  }

  get_id(value) {
    return value.toString()
  }

  getRole(value) {
    return +value
  }

  getPersonType(value) {
    return +value
  }
}

module.exports = User
