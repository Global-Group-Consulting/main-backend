'use strict'

/** @typedef {import('../../@types/Communications.d').IConversation} IConversation */
/** @typedef {import("../../@types/Communications.d").IMessage} IMessage */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const CommunicationException = use("App/Exceptions/CommunicationException.js")

const FileModel = use("App/Models/File")

const ConversationTypes = require("../../enums/MessageTypes")
const { castToObjectId, castToNumber } = require("../Helpers/ModelFormatters.js")

class Conversation extends Model {
  static get computed() {
    return ['id']
  }

  static get hidden() {
    return ["_id"]
  }

  static boot() {
    super.boot()

  }

  /** 
   * @param {IConversation} payload
   */
  static create(payload) {
    return super.create(payload)
  }

  /**
   * Fetches all the communications where the user is a watcher.
   * 
   * @param {string} userId 
   * @returns {Promise<IConversation[]>}
   */
  static async getAll(userId) {
    userId = castToObjectId(userId)

    const result = await Conversation.query()
      .where(
        {
          watchersIds: { $elemMatch: { $eq: userId } }
        }
      )
      .with("unreadMessages", async query => {
        query.where({
          receiverId: castToObjectId(userId),
          senderId: { $not: { $eq: castToObjectId(userId) } },
          read_at: { $exists: false }
        })
      })
      .sort({ "updated_at": -1, "subject": -1 })
      .fetch()

    return result.toJSON().map(_row => {
      _row.unreadMessages = _row.unreadMessages.length

      return _row
    })
  }

  /**
  * Fetches the messages for a single conversation
  * 
  * @param {string} userId 
  * @returns {Promise<IConversation>}
  */
  static async getMessages(conversationId, userId) {
    conversationId = castToObjectId(conversationId)

    const result = (await Conversation.query()
      .with("messages", query => {
        query.with("sender", query => {
          query.setVisible(["firstName", "lastName", "role"])
        })

      })
      .where({ _id: conversationId })
      .first()).toJSON()

    const messages = {}
    const uid = userId.toString()

    for (const _message of result.messages) {
      const messageId = _message.messageId

      if (!messageId) {
        continue
      }

      if (!messages[messageId]) {
        messages[messageId] = null
      }

      // sent by the user, return user own
      if (_message.senderId === uid) {
        if (_message.receiverId === uid) {
          messages[messageId] = _message
        }
      } else {
        if (_message.receiverId === uid) {
          messages[messageId] = _message
        }
      }

      if (!messages[messageId]) {
        messages[messageId] = _message
      }
    }

    result.messages = Object.values(messages)

    for (const _row of result.messages) {
      _row.sender = {
        role: _row.sender.role,
        name: `${_row.sender.firstName} ${_row.sender.lastName.slice(0, 1)}.`
      }

      if (_row.filesIds) {
        _row.files = await FileModel.where(
          {
            _id: { $in: _row.filesIds }
          }
        ).setVisible(["id", "extname", "clientName", "type", "subtype"])
          .fetch()
      }
    }

    return result
  }

  /**
   * 
   * @param {IMessage} message 
   * @returns {IConversation}
   */
  static async upsert(message) {
    /** @type {IConversation} */
    let conversation = null

    if (!message.senderId) {
      throw new CommunicationException("Missing communication sender")
    }

    if (!message.receiverId) {
      throw new CommunicationException("Missing communication receiver")
    }

    const sender = castToObjectId(message.senderId)
    const receiver = castToObjectId(message.receiverId)

    // If the user provides a conversation id, means that is trying to reply to a message.
    if (message.conversationId) {
      conversation = await Conversation.find(message.conversationId)

      if (!conversation) {
        throw new CommunicationException("Can't find any conversation with the provided id.")
      }

      conversation.messagesCount += 1

      // I check if the person who is answering is a watcher of the conversation. If no, i add it.
      if (!conversation.watchersIds.find(_watcher => _watcher.toString() === receiver.toString())) {
        conversation.watchersIds.push(receiver)
      }

      await conversation.save()
    } else {
      // If there is no conversation id provided, creates a new one.
      conversation = await Conversation.create({
        createdById: sender,
        directedToId: receiver,
        // Default to one because if the conversation is created is due to a message that has to be created
        messages: 1,
        subject: message.subject,
        watchersIds: [sender, receiver], // Immediately add as watchers the sender and the receiver
      })
    }

    return conversation
  }

  messages() {
    return this.hasMany("App/Models/Message", "_id", "conversationId")
  }

  unreadMessages() {
    return this.hasMany("App/Models/Message", "_id", "conversationId")
  }

  getId({ _id }) {
    return _id.toString()
  }

  setCreatedById(value) {
    return castToObjectId(value)
  }

  setDirectedToId(value) {
    return castToObjectId(value)
  }

  setMessagesCount(value) {
    return castToNumber(value)
  }
}

module.exports = Conversation
