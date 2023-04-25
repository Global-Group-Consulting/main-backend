'use strict'

/** @typedef {import("../../@types/Communications.d").IMessage} IMessage */
/** @typedef {import("@adonisjs/lucid/src/Lucid/Serializers/Vanilla")} VanillaSerializer */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {typeof import('./Conversation')} */
const ConversationModel = use("App/Models/Conversation")

const FileModel = use("App/Models/File")
const CommunicationException = use("App/Exceptions/CommunicationException")
const Event = use("Event")

const MessageTypes = require("../../enums/MessageTypes")

const {castToObjectId, castToNumber} = require("../Helpers/ModelFormatters.js")

class Message extends Model {
  static get computed() {
    return ['id']
  }

  static boot() {
    super.boot()

    this.addHook("beforeCreate",
      /** @param {IMessage} message */
      async message => {
        if (!message.senderId) {
          throw new CommunicationException("Missing message sender")
        }

        if (!message.receiverId) {
          throw new CommunicationException("Missing message receiver")
        }

        // If the message is of type conversation, upsert the conversation and store
        // inside the message, the conversationId
        if ([MessageTypes.CONVERSATION, MessageTypes.BRITE_USE, MessageTypes.BUG_REPORT].includes(+message.type)) {
          const conversation = await ConversationModel.upsert(message)

          message.conversationId = conversation._id
        }
      })

    this.addHook("afterCreate", async (message) => {
      message.files = await Message.getFiles(message.filesIds)

      const sender = await message.sender().fetch()
      const payload = message.toJSON()

      payload.senderName = `${sender.firstName} ${sender.lastName}`

      Event.emit("notification::messageNew", payload)
    })
  }

  static async getFiles(filesIds) {
    if (!filesIds) {
      return
    }

    return await FileModel.where(
      {
        _id: {$in: filesIds}
      }
    ).setVisible(["id", "extname", "clientName", "type", "subtype"])
      .fetch()
  }

  /**
   * Fetches all the messages that are not part of a conversation
   * @param {string} userId
   * @returns {Promise<VanillaSerializer>}
   */
  static async getSimpleMessages(userId) {
    userId = castToObjectId(userId)

    const data = (await Message.where({
        $and: [
          {
            $or: [
              { receiverId: userId },
              { receiverId: null }
            ]
          },
          {
            type: {$not: {$in: [MessageTypes.CONVERSATION, MessageTypes.BUG_REPORT]}}
          }
        ]
      })
        .sort({created_at: -1, updated_at: -1, subject: -1})
        .fetch()
    ).toJSON()

    for (const _row of data) {

      _row.files = await this.getFiles(_row.filesIds)
    }

    return data
  }

  /**
   * Fetches all the messages that are not part of a conversation
   * @param {string} userId
   * @returns {Promise<VanillaSerializer>}
   */
  static async getSimpleMessagesSent(userId) {
    userId = castToObjectId(userId)

    /** @type {IMessage[]} */
    const data = (await Message
        .with("receiver", query => {
          query.setVisible(["id", "firstName", "lastName", "role"])
        })
        .where({
          $and: [
            {
              senderId: userId
            },
            {
              type: {$not: {$in: [MessageTypes.CONVERSATION, MessageTypes.BUG_REPORT]}}
            }
          ]
        })
        .sort({created_at: -1, updated_at: -1, subject: -1})
        .fetch()
    ).toJSON()

    /** @type {{[key:string] : IMessage}} */
    const finalMessages = {}

    for (const _row of data) {
      const messageId = _row.messageId

      if (!finalMessages[messageId]) {
        finalMessages[messageId] = _row
        finalMessages[messageId].receiver = [_row.receiver]
        finalMessages[messageId].files = await this.getFiles(_row.filesIds)
      } else {
        finalMessages[messageId].receiver.push(_row.receiver)
      }
    }

    return Object.values(finalMessages)
  }

  /**
   *
   * @param {string[]} ids
   */
  static async setAsRead(ids, userId) {
    return Message.query()
      .where({
        receiverId: castToObjectId(userId),
        "_id": {$in: castToObjectId(ids)}
      })
      .update({read_at: new Date().toISOString()})
  }

  conversation() {
    return this.belongsTo("App/Models/Conversation", "conversationId", "_id")
  }

  sender() {
    return this.hasOne("App/Models/User", "senderId", "_id")
  }

  receiver() {
    return this.hasOne("App/Models/User", "receiverId", "_id")
  }

  getId({_id, id}) {
    return (_id || id || '').toString()
  }

  setSenderId(value) {
    return castToObjectId(value)
  }

  setReceiverId(value) {
    return castToObjectId(value)
  }

  setConversationId(value) {
    return castToObjectId(value)
  }

  setType(value) {
    return castToNumber(value)
  }

  setRequestId(value) {
    return castToObjectId(value)
  }
}

module.exports = Message
