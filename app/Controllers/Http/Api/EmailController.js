'use strict'

const EmailSender = use('EmailSender')
const User = use('App/Models/User')
const Persona = use('Persona')
const { ObjectId } = require('mongodb')

class EmailController {
  async _getUserById (id) {
    try {
      const user = await User.findOrFail(id)

      return user
    } catch (er) {
      console.log(er)

      return Promise.reject('User not found')
    }
  }

  async _getUserToken (userId, type) {
    try {
      const result = await User.prototype.tokens().RelatedModel.query()
        .where('type', type)
        .where('user_id', ObjectId(userId))
        .first()

      if (!result){
        throw new Error("Token not found")
      }

      return result.token
    } catch (er) {
      console.log(er)

      return Promise.reject('Invalid token')
    }
  }

  async sendUserCreated ({ request, response }) {
    try {
      const id = request.input('id')
      const user = await this._getUserById(id)
      const token = await this._getUserToken(id, 'email')

      if (user.account_status !== 'pending') {
        throw('User already activated')
      }

      await EmailSender.onAccountCreated({
        ...user.toObject(),
        token
      })

      response.ok()
    } catch (er) {
      console.log(er)

      response.badRequest()
    }

  }

  /**
   * Send an email with a token for recovering the password
   */
  async sendPasswordForgot ({ request, response }) {
    try {
      const id = request.input('id')
      const user = await this._getUserById(id)
      const token = await this._getUserToken(id, 'password')

      await EmailSender.onPasswordForgot({
        ...user.toObject(),
        token
      })

      response.ok()
    } catch (er) {
      console.log(er)

      response.badRequest()
    }
  }

}

module.exports = EmailController
