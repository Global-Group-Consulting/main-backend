'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')
const Event = use('Event')
const UserNotFoundException = use('App/Exceptions/UserNotFoundException')

const ContractCounter = use('App/Controllers/Http/CountersController')

/** @type {import("./History")} */
const HistoryModel = use('App/Models/History')

/** @type {typeof import("./SignRequest")} */
const MovementModel = use('App/Models/Movement')
const SignRequestModel = use('App/Models/SignRequest')

const UserRoles = require("../../enums/UserRoles")
const PersonTypes = require("../../enums/PersonTypes")
const AccountStatuses = require("../../enums/AccountStatuses")
const MovementTypes = require("../../enums/MovementTypes")
const arraySort = require('array-sort');

const { castToObjectId, castToNumber, castToIsoDate } = require("../Helpers/ModelFormatters.js")

const { groupBy: _groupBy, omit: _omit, pick: _pick } = require("lodash")

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
    'contractNumberLegacy': '',
    'contractDate': '',
    'contractPercentage': '',
    'contractInitialInvestment': 0,
    'contractIban': '',
    'contractBic': '',
    'commissionsAssigned': {},
    'role': '',
    'referenceAgent': '',
    'created_at': '',
    'updated_at': '',
    'activated_at': '',
    'verified_at': '',
    'account_status': ''
  }

  static get computed() {
    return ["id"]
  }

  /**
 * Hides the fields in the array that returns
 */
  static get hidden() {
    return ['password', '_id', '__v']
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

      userData.files = null

      userData.contractNumber = await (new ContractCounter()).incrementContract()
    })

    this.addHook("afterCreate", async (userData) => {
    })

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      userInstance.files = []

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }

      HistoryModel.addChanges(this, userInstance)
    })

    this.addHook('afterSave', async (userData) => {

    })

    this.addHook('afterFind', async (userInstance) => {
    })
    this.addHook('afterFetch', async (userInstances) => {
    })
  }

  static async includeFiles(data) {
    data.files = await data.files().fetch()
  }

  static async includeReferenceAgent(data) {
    data.referenceAgentData = await data.referenceAgentData().fetch()
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

  static async groupByRole(filter = {}, returnFlat = false, project) {
    let data = await this.where({ ...filter })
      .sort({ firstName: 1, lastName: 1 })
      .fetch()

    data = data.rows

    if (project) {
      const mode = Object.values(project).includes(1) ? "pick" : "omit"
      const projectKeys = Object.keys(project)

      data = data.map(_entry => {
        const jsonData = _entry.toJSON()

        if (mode === "pick") {
          return _pick(jsonData, projectKeys)
        } else {
          return _omit(jsonData, projectKeys)
        }
      })
    }

    if (returnFlat) {
      return data || []
    }

    const groupedData = _groupBy(data, (value) => value.role)

    return Object.keys(groupedData).reduce((acc, key) => {
      acc.push({
        id: key.toString(),
        data: groupedData[key]
      })

      return acc
    }, [])
  }

  /**
   *  Return a list of all users that can be mentioned inside a conversation chat.
   */
  static async getQuotableUsers(userId) {
    return await User.query()
      .where({
        role: { $in: [UserRoles.ADMIN, UserRoles.SERV_CLIENTI, UserRoles.AGENTE] },
        _id: { $not: { $eq: castToObjectId(userId) } }
      })
      .setVisible(["id", "firstName", "lastName", "role"])
      .sort({ role: 1, firstName: 1, lastName: 1 })
      .fetch()
  }

  /**
   * Return a list of all users, used by the "new communication" dialog for suggesting receivers.
   */
  static async getReceiversUsers(userId) {
    return await User.query()
      .where({
        account_status: { $in: [AccountStatuses.ACTIVE, AccountStatuses.APPROVED] },
        _id: { $not: { $eq: castToObjectId(userId) } }
      })
      .setVisible(["id", "firstName", "lastName", "role"])
      .sort({ role: 1, firstName: 1, lastName: 1 })
      .fetch()
  }

  static async getUserData(userId) {
    return await this.where("_id", userId)
      .with("referenceAgentData")
      .with("files", query => {
        query.where({"fieldName": {$in: ["docAttachment", "contractInvestmentAttachment"]}})
      })
      .with("contractFiles")
      .first()
  }

  static async getUsersToValidate() {
    return User.query()
      .where({
        account_status: {$in: [AccountStatuses.CREATED, AccountStatuses.MUST_REVALIDATE]}
      })
      .fetch()
  }

  /**
   * @param signRequestId
   * @returns {Promise<User>}
   */
  static async findFromSignRequest(signRequestId) {
    return User.where({"contractSignRequest.uuid": signRequestId}).first()
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

  // movements() {
  //   return this.hasMany('App/Models/Movement', "_id", "userId")
  // }

  files() {
    return this.hasMany('App/Models/File', "_id", "userId")
  }

  accountFiles() {
    return this.hasMany('App/Models/File', "_id", "userId")
      .where({"fieldName": {$in: ["docAttachment", "contractInvestmentAttachment"]}})
  }

  contractFiles() {
    return this.hasMany('App/Models/File', "_id", "userId")
      .where({"fieldName": {$in: ["contractDoc", "contractDocSignLog"]}})
  }

  apiTokens() {
    return this.hasMany('App/Models/Token')
  }

  referenceAgentData() {
    return this.hasOne('App/Models/User', "referenceAgent", "_id").setVisible([
      "id",
      "firstName",
      "lastName",
      "email",
    ])
  }

  async fetchSigningLogs() {
    const logs = await SignRequestModel.where("userId", this._id).fetch()

    if (logs.rows.length === 0) {
      return []
    }

    const lastRows = logs.rows[logs.rows.length - 1]

    if (!lastRows.hooks) {
      return []
    }

    return lastRows.hooks.reduce(
      /**
       * @param {[]} acc
       * @param {import("../../@types/SignRequest/Webhooks.d").WebhooksCall} curr
       */
      (acc, curr) => {
        acc.push({
          event: curr.event_type,
          timestamp: curr.timestamp,
          user: curr.signer ? `${curr.signer.first_name} ${curr.signer.last_name}` : null
        })

        return acc
      }, [])
  }

  async full(includeSignLogs = false) {
    const files = await this.accountFiles().fetch()
    const referenceAgentData = await this.referenceAgentData().fetch()
    const contractFiles = await this.contractFiles().fetch()

    const result = this.toJSON()
    result.files = files.toJSON()
    result.referenceAgentData = referenceAgentData ? referenceAgentData.toJSON() : null
    result.contractFiles = contractFiles.toJSON()

    if (includeSignLogs) {
      result.signinLogs = await this.fetchSigningLogs()
    }

    return result
  }


  get_id(value) {
    return value.toString()
  }

  getId(value) {
    try {
      return this._id.toString()
    } catch (er) {
      return value
    }
  }

  getRole(value) {
    return +value
  }

  getPersonType(value) {
    return +value
  }

  getContractPercentage(value) {
    return +value
  }

  getCommissionsAssigned(value) {
    return value ? value.map(_entry => JSON.parse(_entry)) : []
  }

  // SETTERS

  setRole(value) {
    return castToNumber(value)
  }

  setPersonType(value) {
    return castToNumber(value)
  }

  setDocType(value) {
    return castToNumber(value)
  }

  setContractPercentage(value) {
    return castToNumber(value)
  }

  setContractInitialInvestment(value) {
    return castToNumber(value)
  }

  setContractNumberLegacy(value) {
    return value ? value.toString() : value
  }

  setBirthCountry(value) {
    return value ? value.toString().toLowerCase() : value
  }

  setReferenceAgent(value) {
    return castToObjectId(value)
  }

  setBirthDate(value) {
    return castToIsoDate(value)
  }

  setDocExpiration(value) {
    return castToIsoDate(value)
  }
}

module.exports = User
