'use strict'

/** @typedef {import('../../@types/Request.d').Request} IRequest \ */
/** @typedef {import('../../@types/Movement.d').default} IMovement \ */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')
const Database = use('Database')

/** @type {typeof import("./User")} */
const UserModel = use('App/Models/User')

/** @type {typeof import("./Movement")} */
const MovementModel = use("App/Models/Movement")
/** @type {typeof import("./Commission")} */
const CommissionModel = use("App/Models/Commission")

const {Types: MongoTypes} = require('mongoose');
const moment = require("moment")

const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require("../../enums/RequestTypes")
const MovementTypes = require("../../enums/MovementTypes")
const MovementErrorException = require('../Exceptions/MovementErrorException')
const RequestException = require('../Exceptions/RequestException')
const {query} = require('@adonisjs/lucid/src/Lucid/Model')


const {castToIsoDate, castToObjectId, castToNumber} = require("../Helpers/ModelFormatters")

const modelFields = {
  userId: "",
  state: "",
  type: "",
  amount: "",
  created_at: "",
  updated_at: "",
  completed_at: "",
  contractNumber: "",
  email: "",
  firstName: "",
  lastName: "",
}

class Request extends Model {
  static db

  static get hidden() {
    return ['_id', "__v"]
  }

  static async boot() {
    super.boot()

    this.db = await Database.connect('mongodb')

    this.addHook("beforeCreate", /** @param {IRequest} data */async (data) => {

      // Auto approve some types of requests
      if ([
        RequestTypes.RISC_INTERESSI,
        RequestTypes.RISC_INTERESSI_BRITE,
        RequestTypes.RISC_INTERESSI_GOLD,
        RequestTypes.RISC_PROVVIGIONI,
      ].includes(data.type)) {
        const typeData = RequestTypes.get(data.type)

        try {
          const user = await UserModel.find(data.userId)
          let generatedMovement

          if (RequestTypes.RISC_PROVVIGIONI === data.type) {
            /*
             If the request is periodic or for the current month, shouldn't generate any commission movement.
             this should be generated in a second moment.
            */
            if (!data.autoWithdrawlAll) {
              generatedMovement = await CommissionModel.collectCommissions(data.userId, data.amount)
            }
          } else {
            const movementData = {
              userId: data.userId,
              movementType: typeData.movement,
              amountChange: data.amount,
              interestPercentage: +user.contractPercentage,
            }

            if (data.typeClub) {
              movementData.iban = data.iban
              movementData.clubCardNumber = data.clubCardNumber
              movementData.typeClub = data.typeClub
            }

            generatedMovement = await MovementModel.create(movementData)
          }

          data.movementId = generatedMovement ? generatedMovement._id : null

          if (!data.autoWithdrawlAll) {
            data.status = RequestStatus.ACCETTATA
            data.completed_at = new Date().toISOString()
          } else {
            data.status = RequestStatus.LAVORAZIONE
          }
        } catch (er) {
          data.rejectReason = er.message
          data.status = RequestStatus.RIFIUTATA
        }
      } else {
        data.status = RequestStatus.NUOVA
      }
    })

    this.addHook("beforeSave", /** @param {IRequest} data */async (data) => {
      data.files = null

      let lastMovement = await MovementModel.getLast(data.userId)

      if (!lastMovement) {
        lastMovement = {
          deposit: 0,
          interestAmountOld: 0
        }
      }

      // Store the current available amount for future reference
      if ([
        RequestTypes.RISC_CAPITALE,
        RequestTypes.VERSAMENTO].includes(data.type)) {
        data.availableAmount = lastMovement.deposit

      } else if ([RequestTypes.RISC_INTERESSI, RequestTypes.RISC_INTERESSI_BRITE, RequestTypes.RISC_INTERESSI_GOLD].includes(data.type)) {
        data.availableAmount = lastMovement.interestAmountOld

      } else if ([RequestTypes.RISC_PROVVIGIONI].includes(data.type)) {
        /*
        If the request is periodic or for the current month, shouldn't generate any commission movement.
        this should be generated in a second moment.
         */
        if (!data.autoWithdrawlAll) {
          const commissionMovement = await CommissionModel.find(data.movementId)

          data.availableAmount = commissionMovement.currMonthCommissionsOld
        } else {
          data.availableAmount = await CommissionModel.getAvailableCommissions(data.userId)
        }
      } else if ([RequestTypes.COMMISSION_MANUAL_ADD, RequestTypes.COMMISSION_MANUAL_TRANSFER].includes(data.type)) {
        const commissionMovement = await CommissionModel._getLastCommission(data.targetUserId)

        data.availableAmount = commissionMovement.currMonthCommissions
      }

      if ([
        RequestTypes.RISC_CAPITALE,
        RequestTypes.VERSAMENTO].includes(data.type) && data.status === RequestStatus.ACCETTATA) {
        const typeData = RequestTypes.get(data.type)

        try {
          const user = await UserModel.find(data.userId)

          const movementData = {
            userId: data.userId,
            movementType: data.initialMovement ? MovementTypes.INITIAL_DEPOSIT : typeData.movement,
            amountChange: data.amount,
            interestPercentage: +user.contractPercentage,
            paymentDocDate: data.paymentDocDate
          }

          if (data.typeClub) {
            movementData.iban = data.iban
            movementData.clubCardNumber = data.clubCardNumber
            movementData.typeClub = data.typeClub
          }

          const movement = await MovementModel.create(movementData)

          data.movementId = movement._id
        } catch (er) {
          // data.rejectReason = er.message
          // data.status = RequestStatus.RIFIUTATA

          throw new RequestException("Can't approve the request. " + er.message)
        }
      } else if (RequestTypes.COMMISSION_MANUAL_ADD === data.type && data.status === RequestStatus.ACCETTATA) {
        try {
          const addedCommission = await CommissionModel.manualAdd({
            amountChange: data.amount,
            notes: data.notes,
            userId: data.targetUserId,
            commissionType: data.commissionType,
            referenceAgent: data.referenceAgent,
            refAgentAvailableAmount: data.refAgentAvailableAmount,
            requestId: data._id,
            created_by: data.userId
          });

          data.movementId = addedCommission._id
        } catch (er) {
          throw new RequestException("Can't approve the request. " + er.message)
        }
      }

      if (data.status === RequestStatus.ANNULLATA && !data.autoWithdrawlAll) {
        await data.cancelRequest()
      }
    })

    this.addHook("afterCreate", async (data) => {
      this.switchIdField(data)
    })
    this.addHook('afterFind', async (data) => {
      this.switchIdField(data)
      await this.includeFiles(data)
    })
    this.addHook('afterFetch', async (data) => {
      for (const inst of data) {
        this.switchIdField(inst)
        await this.includeFiles(inst)
      }
    })

    this.addHook('afterDelete', async (data) => {
      await File.deleteAllWith(data.id, "requestId")
    })
  }

  static async includeFiles(data) {
    const files = await File.where({requestId: data.id}).fetch()

    data.files = files.rows || files
  }

  static switchIdField(data) {
    data.id = data._id.toString()

    return data
  }

  static async reqWithUser(id) {
    return this.query()
      .where("_id", castToObjectId(id))
      .with("user", query => {
        query.setVisible([
          'id',
          'firstName',
          'lastName',
          'email',
          'contractNumber'
        ])
          .with("referenceAgentData", q => {
            q.setVisible([
              'id',
              'firstName',
              'lastName',
              'email',
            ])
          })
      })
      .with("targetUser", query => {
        query.setVisible([
          'id',
          'firstName',
          'lastName',
          'email',
          'contractNumber'
        ])
      })
      .with("conversation", query => {
        query.with("creator",
          _creatorQuery => _creatorQuery.setVisible(["firstName", "lastName", "id"])
        )
      })
      .with("files")
      .first()
  }

  static async allWithUser(sorting = {}) {
    // TODO:: i must avoid returning all this data, instead i should return the minimum data and when a request got open, return all its data

    const currDate = moment()
    const lastMonth = moment()

    /*lastMonth.set({
      date: 16,
      month: currDate.month(),
      hour: 0,
      minute: 0,
      second: 0
    }).subtract(1, "months")*/

    lastMonth.subtract(40, "days")

    return this.query()
      .where({
        created_at: {
          $gte: lastMonth.toDate()
        }
      })
      .with("user", query => {
        query.setVisible([
          'id',
          'firstName',
          'lastName',
          'email',
          'contractNumber'
        ])
          .with("referenceAgentData", q => {
            q.setVisible([
              'id',
              'firstName',
              'lastName',
              'email',
            ])
          })
      })
      .with("targetUser", query => {
        query.setVisible([
          'id',
          'firstName',
          'lastName',
          'email',
          'contractNumber'
        ])
      })
      .with("conversation", query => {
        query.with("creator",
          _creatorQuery => _creatorQuery.setVisible(["firstName", "lastName", "id"])
        )
      })
      // .with("files")
      .sort(sorting)
      .fetch()

  }

  static async allWithUserPaginated(sorting, page = 1, perPage = 25) {
    return this.db.collection("requests")
      .aggregate([
        {
          "$sort": sorting
        },
        {
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
              },
              {
                '$project': {
                  'id': 1,
                  'firstName': 1,
                  'lastName': 1,
                  'email': 1,
                  'contractNumber': 1,
                  'referenceAgent': 1
                }
              },
              {
                '$lookup': {
                  'from': 'users',
                  'let': {
                    'agentId': '$referenceAgent'
                  },
                  'as': "referenceAgentData",
                  'pipeline': [
                    {
                      '$match': {
                        '$expr': {
                          '$eq': [
                            '$_id', '$$agentId'
                          ]
                        }
                      }
                    },
                    {
                      '$project': {
                        'id': 1,
                        'firstName': 1,
                        'lastName': 1,
                        'email': 1,
                      }
                    },
                  ]
                }
              },
              {
                '$unwind': {
                  'path': '$referenceAgentData',
                  'preserveNullAndEmptyArrays': true
                }
              }
            ],
          }
        },
        {
          '$unwind': {
            'path': '$user'
          }
        }
      ]).toArray()
  }

  /**
   * @param {string | ObjectId} userId
   * @param {{}} [sorting]
   */
  static async allForUser(userId, sorting) {
    /** @type {IMovement} */
    const lastRecapitalization = await MovementModel.getLastRecapitalization(userId)

    /** @type {{rows: IRequest[]}} */
    const data = await Request
      .where({userId: {$in: [userId.toString(), userId.constructor.name === "ObjectID" ? userId : new MongoTypes.ObjectId(userId)]}})
      .with("targetUser", query => {
        query.setVisible([
          'id',
          'firstName',
          'lastName',
          'email',
          'contractNumber'
        ])
      })
      .with("movement")
      .with("conversation")
      .sort(sorting || {"completed_at": -1}).fetch()

    return data.rows.map(_entry => {
      _entry.canCancel = false

      const jsonData = _entry.toJSON()

      if (_entry.status === RequestStatus.ACCETTATA && jsonData.movement && jsonData.completed_at
        && [MovementTypes.DEPOSIT_COLLECTED, MovementTypes.INTEREST_COLLECTED, MovementTypes.COMMISSION_COLLECTED].includes(+jsonData.movement.movementType)) {
        _entry.canCancel = moment(_entry.completed_at).isAfter(moment(lastRecapitalization.created_at))
      }

      return _entry
    })

  }

  /**
   * Fetches all the pending requests, useful for the admin dashboard
   *
   * @param {number} userRole
   */
  static async getPendingOnes(userRole) {
    return await Request.where({
      status: {$in: [RequestStatus.NUOVA, RequestStatus.LAVORAZIONE]},
      autoWithdrawlAll: {$ne: true},
      type: {$ne: RequestTypes.RISC_INTERESSI_GOLD}
    })
      .with("user", query => query.setVisible(['firstName', 'lastName', 'email', 'contractNumber', "id"])
        .with("referenceAgentData", q => {
          q.setVisible([
            'id',
            'firstName',
            'lastName',
            'email',
          ])
        }))
      .with("targetUser", query => query.setVisible(['firstName', 'lastName', 'email', 'contractNumber', "id"]))
      .sort({status: 1, created_at: -1, type: 1})
      .fetch()
  }

  static async setToWorkingState(id) {
    const request = await this.find(id)

    request.status = RequestStatus.LAVORAZIONE

    await request.save()
  }

  /**
   *
   * @param {string} date - YYYY-MM
   * @returns {Promise<void>}
   */
  static async getReportData(date) {
    /*
    Richieste da recuperare
    - Prelievo capitale
    - Riscossione Interessi (Classic)
    - Riscossione Interessi Gold (Brite)
    - Riscossione Interessi Gold (Fisico)
     */
    const reqToSearch = [RequestTypes.RISC_CAPITALE, RequestTypes.RISC_INTERESSI, RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE]

    /*
    il report deve contenere 3 tab
    - Riscossione provvigioni
      - dal 1 al 30 del mese precedente (quelle riscosse che non sono state bloccate il 1)
    - Riscossioni rendite classic
      - Riscossione degli interessi maturati dal 16 al 15
    - Riscossione rendite gold
      - Riscossione degli interessi maturati dal 16 al 15
      - Inserire sia gold che brite (aggiuhngere colonna che mostra uno o l'altro)
      - In fase di download, se una richiesta è classic, ma l'utente è gold, inserire quella richiesta nella pagina relativa ai gold.


    Il giorno 16, mandare agli admin un email che li invita a scaricare il report del mese con i versamenti da effettuare.


    Aggiungere le seguenti colonne:
    Importo
    Tipo richiesta (nome + gold o fisico)
    Nome Cognome
    IBAN
    BIC
    Note
    Agente riferimento
     */

    const momentDate = moment(date, "YYYY-MM")
    const startDate = moment(momentDate).subtract(1, "months").set({
      date: 16,
      hour: 0,
      minute: 0,
      second: 0,
    })
    const endDate = moment(momentDate).set({
      date: 15,
      hour: 23,
      minute: 59,
      second: 59,
    })
    const commissionsStartDate = moment(momentDate).subtract(1, "months").set({
      date: 1,
      hour: 0,
      minute: 0,
      second: 0,
    })
    const commissionsEndDate = moment(momentDate).set({
      date: 1,
      hour: 23,
      minute: 59,
      second: 59,
    }).subtract(1, "days")

    const query = {
      $or: [
        {
          type: {$in: reqToSearch},
          status: RequestStatus.ACCETTATA,
          created_at: {
              $gte: startDate.toDate(),
              $lte: endDate.toDate()
          }
        },
        {
          // Riscossione provvigioni agenti
          type: RequestTypes.RISC_PROVVIGIONI,
          status: RequestStatus.ACCETTATA,
          created_at: {
              $gt: commissionsStartDate.toDate(),
              $lte: commissionsEndDate.toDate()
          }
        }
      ]
    }

    /* const data = await this.where(query)
       .with("user")
       .sort({
         userId: 1,
         type: 1
       })
       .fetch()*/

    const data = await this.db.collection("requests")
      .aggregate([
        {
          "$sort": {
            userId: 1,
            type: 1
          }
        },
        {
          "$match": query
        },
        {
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
                    "$eq": ['$_id', '$$userId']
                  }
                }
              },
              {
                '$project': {
                  'id': 1,
                  'firstName': 1,
                  'lastName': 1,
                  'email': 1,
                  'contractNumber': 1,
                  'referenceAgent': 1,
                  'clubPack': 1,
                }
              },
              {
                '$lookup': {
                  'from': 'users',
                  'let': {
                    'agentId': '$referenceAgent'
                  },
                  'as': "referenceAgentData",
                  'pipeline': [
                    {
                      '$match': {
                        '$expr': {
                          '$eq': [
                            '$_id', '$$agentId'
                          ]
                        }
                      }
                    },
                    {
                      '$project': {
                        'id': 1,
                        'firstName': 1,
                        'lastName': 1,
                        'email': 1,
                      }
                    },
                  ]
                }
              },
              {
                '$unwind': {
                  'path': '$referenceAgentData',
                  'preserveNullAndEmptyArrays': true
                }
              }
            ],
          }
        },
        {
          '$unwind': {
            'path': '$user'
          }
        }
      ]).toArray()

    const jsonData = data //data.toJSON()

    //  In fase di download, se una richiesta è classic, ma l'utente è gold, inserire quella richiesta nella pagina relativa ai gold.
    for (const entry of jsonData) {
      const classicReq = entry.type === RequestTypes.RISC_INTERESSI

      // Se un utente ha fatto classic ma è gold la richiesta viene scaricata in gold (NON FISICO)
      if (entry.user.gold && classicReq) {
        entry.typeOriginal = entry.type;
        entry.type = RequestTypes.RISC_INTERESSI_BRITE;
      }
    }

    return jsonData
  }

  static async findByIdOrMovementId(id) {
    const objId = castToObjectId(id)

    return this.query().where({$or: [{_id: objId}, {movementId: objId}]}).first()
  }

  static async getLastAutoWithdrawlRequest(userId) {
    return UserModel.query()
      .where({userId: castToObjectId(userId),})
  }

  static async getActiveAutoWithdrawlRequests(userId) {
    const requests = await this.query()
      .where({
        userId: castToObjectId(userId),
        autoWithdrawlAll: true,
        autoWithdrawlAllRevoked: {$ne: true}
      })
      .setVisible(["_id"])
      .fetch()

    return requests.rows
  }

  async cancelRequest() {
    /* const typeData = RequestTypes.get(data.type)
    const movementData = MovementTypes.get(typeData.movement) */

    const movementRef = await MovementModel.find(this.movementId)

    if (!movementRef) {
      throw new MovementErrorException("Movement not found.")
    }

    const movementCancelRef = await MovementModel.where({cancelRef: movementRef._id}).first()

    if (movementCancelRef) {
      throw new MovementErrorException("Movement already canceled.")
    }

    const movementType = MovementTypes.get(movementRef.movementType).cancel
    const jsonData = movementRef.toJSON()

    if (!movementType) {
      throw new MovementError("Can't cancel this type of movement.")
    }

    delete jsonData._id

    try {
      const user = await UserModel.find(this.userId)

      const movement = await MovementModel.create({
        ...jsonData,
        movementType,
        depositOld: jsonData.deposit,
        cancelRef: movementRef._id,
        cancelReason: this.cancelReason,
        interestPercentage: +user.contractPercentage
      })

      this.movementId = movement._id
    } catch (er) {
      throw new Error("Can't cancel this request.", er.message)
    }
  }

  user() {
    return this.belongsTo('App/Models/User', "userId", "_id")
  }

  files() {
    return this.belongsTo('App/Models/User', "requestId", "_id")
  }

  movement() {
    if (this.type === RequestTypes.RISC_PROVVIGIONI) {
      return this.hasOne('App/Models/Commission', "movementId", "_id")
    } else {
      return this.hasOne('App/Models/Movement', "movementId", "_id")
    }
  }

  conversation() {
    return this.hasOne('App/Models/Conversation', "_id", "requestId")
  }

  targetUser() {
    return this.belongsTo('App/Models/User', "targetUserId", "_id")
  }

  get_id(value) {
    return value.toString()
  }

  getId(value) {
    return this._id.toString()
  }

  getStatus(value) {
    return +value
  }

  getType(value) {
    return +value
  }

  getWallet(value) {
    return +value
  }

  getCurrency(value) {
    return +value
  }

  setAmount(value) {
    return +value
  }

  setCompletedAt(value) {
    return castToIsoDate(value)
  }

  setCurrency(value) {
    return castToNumber(value)
  }

  setType(value) {
    return +value
  }

  setStatus(value) {
    return +value
  }

  setWallet(value) {
    return +value
  }

  setUserId(value) {
    return castToObjectId(value)
  }

  setReferenceAgent(value) {
    return castToObjectId(value)
  }

  setTargetUserId(value) {
    return castToObjectId(value)
  }

  setPaymentDocDate(value) {
    return castToIsoDate(value)
  }

  setLastRun(value) {
    return castToIsoDate(value)
  }
}

module.exports = Request
