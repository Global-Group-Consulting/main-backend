'use strict'

/** @typedef {import('../../@types/Request.d').Request} IRequest \ */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')
const { Types: MongoTypes } = require('mongoose');

const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require("../../enums/RequestTypes")

/** @type {typeof import("./Movement")} */
const MovementModel = use("App/Models/Movement")

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
          await MovementModel.create({
            userId: data.userId,
            movementType: typeData.movement,
            amountChange: data.amount,
          })

          data.status = RequestStatus.ACCETTATA
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
          await MovementModel.create({
            userId: data.userId,
            movementType: typeData.movement,
            amountChange: data.amount,
          })
        } catch (er) {
          data.rejectReason = er.message
          data.status = RequestStatus.RIFIUTATA
        }
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
      }, {
        '$unwind': '$user'
      }, {
        '$project': {
          '_id': 0,
        }
      }
    ])
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
