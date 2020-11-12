'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

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

    this.addHook("afterCreate", async (data) => {
      this.switchIdField(data)
    })
    this.addHook('afterFind', async (data) => {
      this.switchIdField(data)
    })
    this.addHook('afterFetch', async (data) => {
      data.map(inst => this.switchIdField(inst))
    })
  }

  static switchIdField(data) {
    data.id = data._id.toString()

    return data
  }

  get_id(value) {
    return value.toString()
  }

  getId(value) {
    return this._id.toString()
  }
}

module.exports = Request
