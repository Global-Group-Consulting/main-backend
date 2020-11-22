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

const { Types: MongoTypes } = require('mongoose');
const moment = require("moment")

const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require("../../enums/RequestTypes")
const MovementTypes = require("../../enums/MovementTypes")
const MovementErrorException = require('../Exceptions/MovementErrorException')

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
      if ([RequestTypes.RISC_INTERESSI, RequestTypes.INTERESSI].includes(data.type)) {
        const typeData = RequestTypes.get(data.type)

        try {
          const user = await UserModel.find(data.userId)

          const movement = await MovementModel.create({
            userId: data.userId,
            movementType: typeData.movement,
            amountChange: data.amount,
            interestPercentage: +user.contractPercentage,
          })

          data.movementId = movement._id
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
        data.availableAmount = lastMovement.interestAmount
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
      await File.remove("requestId", data.id)
    })
  }

  static async includeFiles(data) {
    const files = await File.where({ requestId: data.id }).fetch()

    data.files = files.rows || files
  }

  static switchIdField(data) {
    data.id = data._id.toString()

    return data
  }

  static async allWithUser(sorting = {}) {
    return this.query().aggregate([
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
      }, /* {
        '$lookup': {
          'from': 'movements',
          'let': {
            "userId": { $toObjectId: "$userId" },
            "completed_at": "$completed_at",
          },
          'pipeline': [
            { "$match": { $expr: { $eq: ["$$userId", "$userId"] } } },
            { "$match": { $expr: { $eq: ["$movementType", 3] } } },
            { "$match": { $expr: { $gt: ["$created_at", "$$completed_at"] } } }
          ],
          'as': 'movement'
        }
      }, */ {
        '$unwind': '$user'
      }, {
        '$project': {
          '_id': 0,
        }
      }
    ])
  }

  /**
   * @param {string | ObjectId} userId
   * @param {{}} [sorting]
   */
  static async allForUser(userId, sorting) {
    /** @type {IMovement} */
    const lastRecapitalization = await MovementModel.getLastRecapitalization(userId)


    /** @type {{rows: IRequest[]}} */
    const data = await Request.with("movement")
      .where({ userId: { $in: [userId.toString(), userId.constructor.name === "ObjectID" ? userId : new MongoTypes.ObjectId(userId)] } })
      .sort(sorting || { "completed_at": -1 }).fetch()

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

  async cancelRequest() {
    /* const typeData = RequestTypes.get(data.type)
    const movementData = MovementTypes.get(typeData.movement) */

    const movementRef = await MovementModel.find(this.movementId)

    if (!movementRef) {
      throw new MovementErrorException("Movement not found.")
    }

    const movementCancelRef = await MovementModel.where({ cancelRef: movementRef._id }).first()

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

  movement() {
    return this.hasOne('App/Models/Movement', "movementId", "_id")
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
}

module.exports = Request
