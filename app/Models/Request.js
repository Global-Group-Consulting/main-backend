'use strict'

/** @typedef {import('../../@types/Request.d').Request} RequestModel */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const File = use('App/Models/File')

const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require("../../enums/RequestTypes")

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

    this.addHook("beforeCreate", /** @param {RequestModel} data */async (data) => {
      data.status = RequestStatus.NUOVA
    })

    this.addHook("beforeSave", /** @param {RequestModel} data */async (data) => {
      data.files = null
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

  static async allWithUser() {
    return this.query().aggregate([
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
}

module.exports = Request
