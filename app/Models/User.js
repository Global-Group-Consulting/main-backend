'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')
const Event = use('Event')
const Database = use('Database')

const UserNotFoundException = use('App/Exceptions/UserNotFoundException')

const ContractCounter = use('App/Controllers/Http/CountersController')

/** @type {import("./History")} */
const HistoryModel = use('App/Models/History')

/** @type {typeof import("./Movement")} */
const MovementModel = use('App/Models/Movement')
/** @type {typeof import("./Request")} */
const AclPermissionsModel = use('App/Models/AclPermissionsModel')
const AclRolesModel = use('App/Models/AclRolesModel')
const SignRequestModel = use('App/Models/SignRequest')

const UserRoles = require("../../enums/UserRoles")
const PersonTypes = require("../../enums/PersonTypes")
const AccountStatuses = require("../../enums/AccountStatuses")
const MovementTypes = require("../../enums/MovementTypes")
const CommissionType = require("../../enums/CommissionType")
const arraySort = require('array-sort');
const Mongoose = require("mongoose")
const moment = require("moment")

const {castToObjectId, castToNumber, castToIsoDate, castToBoolean} = require("../Helpers/ModelFormatters.js")
const {formatBySemester} = require("../Helpers/Utilities/formatBySemester.js")

const {groupBy: _groupBy, omit: _omit, pick: _pick} = require("lodash")

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
    'contractInitialInvestmentGold': 0,
    'contractInitialPaymentMethod': '', // Bonifico, Assegno, Altro
    'contractInitialPaymentMethodOther': '', // quando l'utente seleziona "altro"
    'contractIban': '',
    'contractNotes': '',
    'contractBic': '',
    'commissionsAssigned': {},
    'role': '',
    'referenceAgent': '',
    'created_at': '',
    'updated_at': '',
    'activated_at': '',
    'verified_at': '',
    'account_status': '',
    'gold': false,
    'clubCardNumber': '',
    'clubPack': 'basic',
    'agentTeamType': "",
    'roles': [],
    'directPermissions': []
  }
  static rolesMap = {
    "admin": "admin",
    "servClienti": "clients_service",
    "agente": "agent",
    "cliente": "client",
  }

  static db

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

  static async boot() {
    super.boot()

    this.db = await Database.connect("mongodb")

    this.addHook('beforeCreate', async (userData) => {
      userData.role = userData.role || UserRoles.CLIENTE
      userData.roles = [this.rolesMap[UserRoles.get(userData.role).id]]
      userData.personType = userData.personType || PersonTypes.FISICA

      userData.files = null

      userData.contractNumber = await (new ContractCounter()).incrementContract()
    })

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      userInstance.files = []

      if (!userInstance._id) {
        userInstance._id = new Mongoose.Types.ObjectId()
      }

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }

      HistoryModel.addChanges(this, userInstance.toObject())
    })

    this.addHook("beforeDelete", async (userInstance) => {
      Event.emit("user::deleted", userInstance._id.toString())
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

    return result
  }

  static async groupByRole(filter = {}, returnFlat = false, project) {
    let data = await this.where({...filter})
      .with("referenceAgentData")
      .sort({firstName: 1, lastName: 1})
      .fetch()

    data = data.rows

    data = await Promise.all(data.map(async (el) => {
      if ([UserRoles.AGENTE].includes(el.role)) {
        el.clientsCount = await el.clients().count()
      }

      await el.withEarnings()

      return el
    }))

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
        role: {$in: [UserRoles.ADMIN, UserRoles.SERV_CLIENTI, UserRoles.AGENTE]},
        _id: {$not: {$eq: castToObjectId(userId)}}
      })
      .setVisible(["id", "firstName", "lastName", "role"])
      .sort({role: 1, firstName: 1, lastName: 1})
      .fetch()
  }

  /**
   * Return a list of all users, used by the "new communication" dialog for suggesting receivers.
   */
  static async getReceiversUsers(userId) {
    return await User.query()
      .where({
        account_status: {$in: [AccountStatuses.ACTIVE, AccountStatuses.APPROVED]},
        _id: {$not: {$eq: castToObjectId(userId)}}
      })
      .setVisible(["id", "firstName", "lastName", "role"])
      .sort({role: 1, firstName: 1, lastName: 1})
      .fetch()
  }

  static async getReceiversByRole(role, superAdmin = false) {
    const query = {
      role: +role,
      account_status: {$in: [AccountStatuses.ACTIVE, AccountStatuses.APPROVED]}
    }

    if (superAdmin) {
      query.superaAdmin = true
    }

    return await User.query()
      .where(query)
      .setVisible(["id", "firstName", "lastName", "role"])
      .sort({role: 1, firstName: 1, lastName: 1})
      .fetch()
  }

  static async getReceiversForAgent(userId) {
    return await User.query()
      .where({
        referenceAgent: castToObjectId(userId),
        account_status: {$in: [AccountStatuses.ACTIVE, AccountStatuses.APPROVED]},
        _id: {$not: {$eq: castToObjectId(userId)}}
      })
      .setVisible(["id", "firstName", "lastName", "role"])
      .sort({role: 1, firstName: 1, lastName: 1})
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

  static async getAgentsForCommissionsBlock() {
    const data = await this.db.collection('users')
      .aggregate([
        {
          '$match': {
            'role': {'$in': [UserRoles.AGENTE]},
            'account_status': {'$in': [AccountStatuses.ACTIVE]}
          }
        }, {
          '$lookup': {
            'from': 'commissions',
            'let': {
              'userId': '$_id'
            },
            'as': 'commissions',
            'pipeline': [
              {
                '$match': {
                  '$expr': {'$eq': ['$userId', '$$userId']},
                  'commissionType': CommissionType.COMMISSIONS_TO_REINVEST,
                  'created_at': {'$gte': moment().startOf("month").toDate()}
                }
              }
            ]
          }
        }
      ])
      .toArray();

    // Filtrare solo quelli senza movimenti
    return data.filter(user => user.commissions.length >= 0);

    //return User.where({role: UserRoles.AGENTE, account_status: AccountStatuses.ACTIVE}).fetch()
  }

  static async getServClienti() {
    return User.where({role: UserRoles.SERV_CLIENTI, account_status: AccountStatuses.ACTIVE}).fetch()
  }

  static async getAdmins() {
    return User.where({role: UserRoles.ADMIN, account_status: AccountStatuses.ACTIVE}).fetch()
  }

  static async getUsersToRecapitalize() {
    const data = await this.db.collection('users')
      .aggregate([
        {
          '$match': {
            'role': {'$in': [UserRoles.CLIENTE, UserRoles.AGENTE]},
            'account_status': {'$in': [AccountStatuses.ACTIVE, AccountStatuses.APPROVED]}
          }
        }, {
          '$lookup': {
            'from': 'movements',
            'let': {
              'userId': '$_id'
            },
            'as': 'movements',
            'pipeline': [
              {
                '$match': {
                  '$expr': {'$eq': ['$userId', '$$userId']},
                  'movementType': MovementTypes.INTEREST_RECAPITALIZED,
                  'created_at': {'$gte': moment().startOf("month").toDate()}
                }
              }
            ]
          }
        }
      ])
      .toArray();

    // Filtrare solo quelli senza movimenti
    return data.filter(user => user.movements.length === 0);

    /* return User.where({
       role: {$in: [UserRoles.CLIENTE, UserRoles.AGENTE]},
       account_status: {$in: [AccountStatuses.ACTIVE, AccountStatuses.APPROVED]}
     })
       .with("movements", async q => {
         // recupero anche i movimenti per cercare di capire se per caso c'è una doppia ricapitalizzazione
         q.where({
           movementType: MovementTypes.INTEREST_RECAPITALIZED,
           created_at: {$gt:,}
         })
       })
       .fetch()*/
  }

  /**
   * Return the full list of agent's clients
   *
   * @param {string} agentId
   * @param {string[]} subAgentsIdList
   * @returns {Promise<User[]>}
   */
  static async getClientsList(agentId, subAgentsIdList = []) {
    if (subAgentsIdList.length === 0 || subAgentsIdList.indexOf(agentId) === -1) {
      subAgentsIdList.push(agentId)
    }

    const result = await this.where({
      referenceAgent: {$in: subAgentsIdList.map(id => castToObjectId(id))}
    })
      .with("referenceAgentData")
      .sort({role: 1, _id: 1})
      .fetch()

    return Promise.all(result.rows.map(async (el) => {
      if (el.role === UserRoles.AGENTE) {
        el.clientsCount = await el.clients().count()
      }

      await el.withEarnings()

      return el
    }))
  }

  static async getTargetUser(userId) {
    const data = await this.where({"_id": castToObjectId(userId)})
      .setVisible([
        'id',
        'firstName',
        'lastName',
        'email',
        'contractNumber'
      ]).fetch()

    return data.rows[0]
  }

  /**
   * @param signRequestId
   * @returns {Promise<User>}
   */
  static async findFromSignRequest(signRequestId) {
    return User.where({"contractSignRequest.uuid": signRequestId}).first()
  }

  /**
   *
   * @param {User | string} agent
   * @param {boolean} includeReferenceAgentData=false
   * @returns {Promise<typeof User[]>}
   */
  static async getTeamAgents(agent, includeReferenceAgentData = false) {
    let agentId

    if (typeof agent === "string") {
      agent = await this.find(agent)
    }

    agentId = agent._id

    /**
     * @type {VanillaSerializer}
     */
    const directSubAgents = await this.where({"referenceAgent": agentId, role: UserRoles.AGENTE})
      .with("referenceAgentData")
      .fetch()
    const toReturn = []

    // agent["clientsCount"] = await agent.clients().count()

    toReturn.push(agent)

    /*
     While there are subAgents, cycle thru each one and return it's sub agents, if any
     */
    for (const subAgent of directSubAgents.rows) {
      // I should avoid recursive call and use a while instead
      toReturn.push(...(await this.getTeamAgents(subAgent, includeReferenceAgentData)))
    }

    return toReturn
  }

  static async getPendingSignatures() {
    const result = await this.query()
      .where({
        role: {$in: [UserRoles.CLIENTE, UserRoles.AGENTE]},
        contractSignedAt: {$exists: false},
        account_status: AccountStatuses.VALIDATED
      })
      .with("signinLogs", query => {
        query.where({hooks: {$exists: true}})
      })
      .fetch()

    const jsonData = result.toJSON()

    return jsonData.map(row => {
      if (!row.signinLogs || row.signinLogs.length === 0) {
        return row
      }

      const lastLog = row.signinLogs[row.signinLogs.length - 1]

      row.signinLogs = lastLog.hooks.reduce(
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

      return row
    })
  }

  /**
   *
   * @returns {Promise<{ thisMonth: number, last3Months: number, last6Months: number,  last12Months: number}>}
   */
  static async getNewUsersTotals() {
    // Recupera la lista di tutti gli utenti attivati negli ultimi 12 mesi,
    // partendo dal loro movimento iniziale che si trova nei movimenti di ogni utente
    const users = await this.db.collection('movements')
      .aggregate([
        {
          '$match': {
            'movementType': MovementTypes.INITIAL_DEPOSIT,
            'created_at': {
              '$gte': moment().startOf("month").subtract(12, "months").toDate(),
            }
          }
        }, {
          '$lookup': {
            'from': 'users',
            'let': {
              'userId': '$userId'
            },
            'as': 'user',
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$_id', '$$userId'
                    ]
                  }
                }
              }, {
                '$project': {
                  'id': 1,
                  'firstName': 1,
                  'lastName': 1,
                  'email': 1,
                  'contractNumber': 1,
                  'contractNotes': 1,
                  'referenceAgent': 1,
                  'clubPack': 1
                }
              }
            ]
          }
        }, {
          '$unwind': {
            'path': '$user'
          }
        }, {
          '$addFields': {
            'user.activationDate': {
              '$convert': {
                'input': '$created_at',
                'to': 'date'
              }
            }
          }
        }, {
          '$replaceRoot': {
            'newRoot': '$user'
          }
        }
      ])
      .toArray()

    return formatBySemester(users, "activationDate")
  }

  /**
   * @returns {Promise<{draft: number, active: number, pendingAccess: number, pendingSignature: number, suspended: number}>}
   */
  static async getUsersStatusTotals() {
    /**
     * @type {{_id: {status: string}, suspended: number, count: number}[]}
     */
    const users = await this.db.collection('users')
      .aggregate([
        {
          $group:
            {
              _id: {status: "$account_status"},
              suspended: {$sum: {$cond: [{$eq: ["$suspended", true]}, 1, 0]}},
              count: {$sum: 1}
            }
        }
      ])
      .toArray()

    return {
      draft: (users.find(el => el._id.status === AccountStatuses.DRAFT) || {}),
      active: (users.find(el => el._id.status === AccountStatuses.ACTIVE) || {}),
      pendingAccess: (users.find(el => el._id.status === AccountStatuses.APPROVED) || {}),
      pendingSignature: (users.find(el => el._id.status === AccountStatuses.VALIDATED) || {}),
      /*suspended: users.reduce((acc, el) => {
        acc += el.suspended

        return acc
      }, 0)*/
    }
  }

  static async getAgentsNewUsersTotals() {
    /*
    - Cerco tutte le commissioni di tipo NewDeposit
    - Per ciascuna recupero il movimento relativo,
    - Rifiltro in base al tipo di movimento che deve essere initialDeposit
    - Per ciascun movimento recupero l'utente associato
    - creo una nuova chiave da usare come return,
    - ci aggiungo l'id dell'utente e la data di attivazione
    - replaceRoot settando come dati solo la chiave appena creata (data)
     */
    const aggregation = [
      {
        '$match': {
          'commissionType': CommissionType.NEW_DEPOSIT,
          'indirectCommission': {
            '$ne': true
          }
        }
      }, {
        '$lookup': {
          'from': 'movements',
          'localField': 'movementId',
          'foreignField': '_id',
          'as': 'movement'
        }
      }, {
        '$unwind': {
          'path': '$movement'
        }
      }, {
        '$match': {
          'movement.movementType': MovementTypes.INITIAL_DEPOSIT
        }
      }, {
        '$lookup': {
          'from': 'users',
          'let': {
            'userId': '$userId'
          },
          'as': 'user',
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$_id', '$$userId'
                  ]
                }
              }
            }, {
              '$project': {
                'id': 1,
                'firstName': 1,
                'lastName': 1,
                'email': 1,
                'contractNumber': 1,
                'contractNotes': 1,
                'referenceAgent': 1,
                'clubPack': 1
              }
            }
          ]
        }
      }, {
        '$unwind': {
          'path': '$user'
        }
      }, {
        '$addFields': {
          /*"data.agent.firstName": "$user.firstName",
          "data.agent.lastName": "$user.lastName",
          "data.agent.email": "$user.email",
          "data.agent.id": "$user._id",*/
          "data.user.id": "$clientId",
          "data.user.activationDate": "$created_at"
        }
      },/* {
        '$replaceRoot': {
          'newRoot': '$data'
        }
      }*/
      {
        '$group': {
          '_id': '$userId',
          'totalUsers': {
            '$sum': 1
          },
          'agent': {
            '$first': '$user'
          },
          'users': {
            '$push': '$data.user'
          }
        }
      }, {
        '$sort': {
          'totalUsers': -1
        }
      }
    ];

    /**
     * @type {{_id: {agent:string }, totalUsers: number, agent: User, users: any[]}[]}
     */
    const agentsList = await this.db.collection('commissions').aggregate(aggregation).toArray();
    const toReturn = agentsList.map((agent) => {
      agent.users = formatBySemester(agent.users, "activationDate")

      return agent;
    })

    return toReturn
  }

  static async getAgentsTotalEarnings() {
    /*
    - Cerco tutte le commissioni di tipo NewDeposit
    - Per ciascuna recupero il movimento relativo,
    - Rifiltro in base al tipo di movimento che deve essere initialDeposit
    - Per ciascun movimento recupero l'utente associato
    - creo una nuova chiave da usare come return,
    - ci aggiungo l'id dell'utente e la data di attivazione
    - replaceRoot settando come dati solo la chiave appena creata (data)
     */
    const aggregation = [
      {
        '$match': {
          'commissionType': CommissionType.NEW_DEPOSIT,
          'indirectCommission': {
            '$ne': true
          }
        }
      }, {
        '$lookup': {
          'from': 'users',
          'let': {
            'userId': '$userId'
          },
          'as': 'agent',
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$_id', '$$userId'
                  ]
                }
              }
            }, {
              '$project': {
                'id': 1,
                'firstName': 1,
                'lastName': 1,
                'email': 1,
                'contractNumber': 1,
                'contractNotes': 1,
                'referenceAgent': 1,
                'clubPack': 1
              }
            }
          ]
        }
      }, {
        '$unwind': {
          'path': '$agent'
        }
      }, {
        '$group': {
          '_id': '$userId',
          'totalAmount': {
            '$sum': '$commissionOnValue'
          },
          'count': {
            '$sum': 1
          },
          'agent': {
            '$first': '$agent'
          },
          'totals': {
            '$push': '$$ROOT'
          }
        }
      }, {
        '$sort': {
          'totalAmount': -1
        }
      }
    ];

    /**
     * @type {{_id: {agent:string }, totalUsers: number, agent: User, totals: any[]}[]}
     */
    const agentsList = await this.db.collection('commissions').aggregate(aggregation).toArray();
    const toReturn = agentsList.map((agent) => {
      agent.totals = formatBySemester(agent.totals, "created_at", {field: "commissionOnValue"})

      return agent;
    })


    return toReturn
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

  movements() {
    return this.hasMany('App/Models/Movement', "_id", "userId")
  }

  async withEarnings() {
    const movement = await MovementModel.where({userId: this._id})
      .sort({created_at: -1})
      .first()

    this.earnings = {
      deposit: movement ? movement.deposit : 0,
      interests: movement ? movement.interestAmount : 0
    }

    return this
  }

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
    return this.hasOne('App/Models/User', "referenceAgent", "_id")
      .setVisible([
        "id",
        "firstName",
        "lastName",
        "email",
        "commissionsAssigned"
      ])
  }

  subAgents() {
    return this.hasMany('App/Models/User', "_id", "referenceAgent")
      .where({role: UserRoles.AGENTE})
  }

  clients() {
    return this.hasMany('App/Models/User', "_id", "referenceAgent")
  }

  brites() {
    return this.hasMany('App/Models/Brite', "_id", "userId")
  }

  signinLogs() {
    return this.hasMany(SignRequestModel, "_id", "userId")
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
    const initialMovement = await MovementModel.getInitialInvestment(this._id)

    const result = this.toJSON()
    result.files = files.toJSON()
    result.referenceAgentData = referenceAgentData ? referenceAgentData.toJSON() : null

    if (initialMovement || result.contractImported) {
      result.contractFiles = (await this.contractFiles().fetch()).toJSON()
    }

    result.hasSubAgents = (await this.subAgents().fetch()).rows.length > 0
    result.permissions = await this.permissions()

    if (includeSignLogs) {
      // result.signinLogs = await this.fetchSigningLogs()
    }

    return result
  }

  async permissions() {
    return AclRolesModel.getAllPermissions(this.roles, this.directPermissions)
  }

  isAdmin() {
    return [UserRoles.ADMIN, UserRoles.SERV_CLIENTI].includes(+this.role)
  }

  isAgent() {
    return [UserRoles.AGENTE].includes(+this.role)
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

  getBirthCountry(value) {
    return value ? value.toString().toLowerCase() : value
  }

  getBirthProvince(value) {
    return value ? value.toString().toLowerCase() : value
  }

  getLegalRepresentativeCountry(value) {
    return value ? value.toString().toLowerCase() : value
  }

  getLegalRepresentativeProvince(value) {
    return value ? value.toString().toLowerCase() : value
  }

  // SETTERS

  setEmail(value) {
    return value ? value.toString().toLowerCase() : value
  }

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

  setBirthProvince(value) {
    return value ? value.toString().toLowerCase() : value
  }

  setBirthDate(value) {
    return castToIsoDate(value)
  }

  setLegalRepresentativeCountry(value) {
    return value ? value.toString().toLowerCase() : value
  }

  setLegalRepresentativeProvince(value) {
    return value ? value.toString().toLowerCase() : value
  }

  setReferenceAgent(value) {
    return castToObjectId(value)
  }

  setLastChangedBy(value) {
    return castToObjectId(value)
  }

  setDocExpiration(value) {
    return castToIsoDate(value)
  }

  setGold(value) {
    return castToBoolean(value)
  }
}

module.exports = User
