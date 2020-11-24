'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')
const UserNotFoundException = use('App/Exceptions/UserNotFoundException')

const ContractCounter = use('App/Controllers/Http/CountersController')

/** @type {import("./History")} */
const HistoryModel = use('App/Models/History')

/** @type {typeof import("./Movement")} */
const MovementModel = use('App/Models/Movement')

const UserRoles = require("../../enums/UserRoles")
const PersonTypes = require("../../enums/PersonTypes")
const AccountStatuses = require("../../enums/AccountStatuses")
const MovementTypes = require("../../enums/MovementTypes")

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
    // const files = await File.where({ userId: { $in: [data.id.toString(), data.id] } }).fetch()
    const files = await data.files().fetch()

    data.files = files.rows ? files.rows : files
  }

  static async includeReferenceAgent(data) {
    const agent = await data.fetchReferenceAgent().fetch()

    if (agent) {
      const jsonData = agent.toJSON()

      data.referenceAgentData = {
        id: jsonData.id,
        firstName: jsonData.firstName,
        lastName: jsonData.lastName,
        email: jsonData.email,
      }
    }
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

      userInstance.files = []

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }

      if (userInstance.account_status === AccountStatuses.APPROVED) {
        const lastMovement = await MovementModel.getLast(userInstance.id)

        if (!lastMovement) {
          try {
            await MovementModel.create({
              userId: userInstance,
              movementType: MovementTypes.INITIAL_DEPOSIT,
              amountChange: +userInstance.contractInitialInvestment,
              interestPercentage: +userInstance.contractPercentage
            })
          } catch (er) {
            throw new Error("Can't create initial deposit movement. " + er.message)
          }
        }
      }

      HistoryModel.addChanges(this, userInstance)
    })

    this.addHook('afterSave', async (userData) => {
      await this.includeFiles(userData)
    })

    this.addHook('afterFind', async (userInstance) => {
      userInstance.id = userInstance._id

      await this.includeFiles(userInstance)

      if (![UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(userInstance.role) &&
        userInstance.referenceAgent) {
        await this.includeReferenceAgent(userInstance)
      }
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

  // movements() {
  //   return this.hasMany('App/Models/Movement', "_id", "userId")
  // }

  files() {
    return this.hasMany(File, "_id", "userId")
  }

  apiTokens() {
    return this.hasMany('App/Models/Token')
  }

  fetchReferenceAgent() {
    return this.hasOne(User, "referenceAgent", "_id")
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

  getContractPercentage(value) {
    return +value
  }

  setRole(value) {
    return value ? +value : value
  }

  setPersonType(value) {
    return value ? +value : value
  }

  setContractInitialInvestment(value) {
    return value ? +value : value
  }
}

module.exports = User
