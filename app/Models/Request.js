'use strict'

/** @typedef {import('../../@types/Request.d').Request} IRequest \ */
/** @typedef {import('../../@types/Movement.d').default} IMovement \ */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')

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
const {query} = require('@adonisjs/lucid/src/Lucid/Model')


const {castToIsoDate} = require("../Helpers/ModelFormatters")

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
  static get hidden() {
    return ['_id', "__v"]
  }

  static boot() {
    super.boot()

    this.addHook("beforeCreate", /** @param {IRequest} data */async (data) => {

      // Auto approve some types of requests
      if ([RequestTypes.RISC_INTERESSI, RequestTypes.RISC_PROVVIGIONI].includes(data.type)) {
        const typeData = RequestTypes.get(data.type)

        try {
          const user = await UserModel.find(data.userId)
          let generatedMovement

          if (RequestTypes.RISC_PROVVIGIONI === data.type) {
            generatedMovement = await CommissionModel.collectCommissions(data.userId, data.amount)
          } else {
            generatedMovement = await MovementModel.create({
              userId: data.userId,
              movementType: typeData.movement,
              amountChange: data.amount,
              interestPercentage: +user.contractPercentage,
            })
          }

          data.movementId = generatedMovement._id
          data.status = RequestStatus.ACCETTATA
          data.completed_at = new Date().toISOString()
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

      const lastMovement = await MovementModel.getLast(data.userId)

      // Store the current available amount for future reference
      if ([RequestTypes.RISC_CAPITALE, RequestTypes.VERSAMENTO].includes(data.type)) {
        data.availableAmount = lastMovement.deposit
      } else if (RequestTypes.RISC_INTERESSI === data.type) {
        data.availableAmount = lastMovement.interestAmountOld
      } else if (RequestTypes.RISC_PROVVIGIONI === data.type) {
        const commissionMovement = await CommissionModel.find(data.movementId)
        data.availableAmount = commissionMovement.currMonthCommissionsOld
      }

      if ([RequestTypes.RISC_CAPITALE, RequestTypes.VERSAMENTO].includes(data.type) && data.status === RequestStatus.ACCETTATA) {
        const typeData = RequestTypes.get(data.type)

        try {
          const user = await UserModel.find(data.userId)

          const movement = await MovementModel.create({
            userId: data.userId,
            movementType: typeData.movement,
            amountChange: data.amount,
            interestPercentage: +user.contractPercentage,
            paymentDocDate: data.paymentDocDate
          })

          data.movementId = movement._id
        } catch (er) {
          // data.rejectReason = er.message
          // data.status = RequestStatus.RIFIUTATA

          throw new Error("Can't approve the request.", er.message)
        }
      }

      if (data.status === RequestStatus.ANNULLATA) {
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

  static async allWithUser(sorting = {}) {

    return this.query()
      .with("user", query => {
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
    /* return this.query().aggregate([
      { "$sort": sorting },
      {
        '$addFields': {
          'uId': {
            '$toObjectId': '$userId'
          },
          'id': {
            '$toString': "$_id"
          }
        }
      }, {
        '$lookup': {
          'from': 'users',
          'let': {
            'uId': '$uId'
          },
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$$uId', '$_id'
                  ]
                }
              }
            }, {
              '$project': {
                'uId': 1,
                'id': 1,
                'firstName': 1,
                'lastName': 1,
                'email': 1,
                'contractNumber': 1
              }
            }
          ],
          'as': 'user'
        }
      }, {
        '$lookup': {
          'from': 'files',
          'let': {
            "id": { $toString: "$_id" }
          },
          'pipeline': [
            { "$match": { $expr: { $eq: ["$$id", "$requestId"] } } }
          ],
          'as': 'files'
        }
      }, {
        '$unwind': '$user'
      }, {
        '$project': {
          '_id': 0,
        }
      }
    ]) */
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
      status: RequestStatus.NUOVA
    })
      .with("user", query => query.setVisible(['firstName', 'lastName', 'email', 'contractNumber', "id"]))
      .sort({created_at: -1, type: 1})
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
    const reqToSearch = [RequestTypes.RISC_CAPITALE, RequestTypes.RISC_PROVVIGIONI]

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

    const data = await this.where({
      type: {$in: reqToSearch},
      status: RequestStatus.ACCETTATA,
      created_at: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      }
    })
      .with("user")
      .sort({
        userId: 1,
        type: 1
      })
      .fetch()

    return data
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
    return value ? new MongoTypes.ObjectId(value.toString()) : value
  }

  setPaymentDocDate(value) {
    return castToIsoDate(value)
  }
}

module.exports = Request
