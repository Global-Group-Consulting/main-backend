'use strict'

const MessageTypes = require("../../../../enums/MessageTypes")

/** @typedef {import("../../../../@types/Communications.d").IMessage} IMessage */
/** @typedef {import("../../../../@types/Communications.d").IConversation} IConversation */

/** @type {typeof import("../../../Models/Conversation")} */
const ConversationModel = use('App/Models/Conversation')

/** @type {typeof import("../../../Models/Message")} */
const MessageModel = use('App/Models/Message')

/** @type {typeof import("../../../Models/User")} */
const UserModel = use('App/Models/User')

/** @type {typeof import("../../../Models/File")} */
const FileModel = use('App/Models/File')

const UserRoles = require("../../../../enums/UserRoles")

const { Types: MongoTypes } = require("mongoose")

class ConversationController {
  async readConversationMessages({ params, auth }) {
    const userRole = +auth.user.role
    const conversationId = params.id

    const toReturn = {
      conversation: await ConversationModel.getMessages(conversationId, auth.user.id),
    }

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI, UserRoles.AGENTE].includes(userRole)) {
      toReturn.quotableUsers = await UserModel.getQuotableUsers(auth.user.id)
    }

    return toReturn
  }

  async readAll({ auth, request }) {
    const requestedType = request.qs["t"]
    const requestedTypeOut = typeof request.qs["out"] === "string"

    let toReturn

    switch (+requestedType) {
      case MessageTypes.CONVERSATION:
        toReturn = await ConversationModel.getAll(auth.user.id)

        break;
      case MessageTypes.SERVICE:
        toReturn = await MessageModel[requestedTypeOut ? "getSimpleMessagesSent" : "getSimpleMessages"](auth.user.id)

        break;
      default:
        const messages = await MessageModel.getSimpleMessages(auth.user.id)
        const messagesSent = await MessageModel.getSimpleMessagesSent(auth.user.id)
        const conversations = await ConversationModel.getAll(auth.user.id)

        toReturn = {
          messages,
          messagesSent,
          conversations
        }
    }

    return toReturn
  }

  async readAllReceivers({ auth }) {
    return await UserModel.getReceiversUsers(auth.user.id)
  }



  async create({ request, auth }) {
    const user = auth.user
    const incomingData = request.only(["type", "subject", "content", "receiver"])
    const conversationId = request.input("conversationId")
    const files = request.file("communicationAttachments")

    let storedFiles = null
    let receiverArray = []
    let createdMessages = []
    let conversation = null

    if (files && files.files.length > 0) {
      storedFiles = await FileModel.store(files.files, user.id, auth.user.id)
    }

    if (!(incomingData.receiver instanceof Array)) {
      receiverArray.push(incomingData.receiver)
    } else {
      receiverArray = incomingData.receiver
    }

    if (conversationId) {
      conversation = await ConversationModel.find(conversationId)

      conversation.watchersIds.forEach(_entry => {
        if (!receiverArray.includes(_entry.toString())) {
          receiverArray.push(_entry.toString())
        }
      })
    }

    const messageId = new MongoTypes.ObjectId()


    for (const receiver of receiverArray) {
      /**
       * @type {IMessage}
       */
      const newMessage = {
        // Assign a custom id that identificate a message. 
        // This can have twins sent to other watchers, but the message must remain the same.
        messageId,
        type: incomingData.type,
        subject: incomingData.subject,
        content: incomingData.content,
        receiverId: receiver,
        senderId: user.id,
      }

      // If the message is to the same user that created it set it as read Immediately
      if (newMessage.senderId === newMessage.receiverId) {
        newMessage.read_at = new Date().toISOString()
      }

      if (storedFiles) {
        newMessage.filesIds = storedFiles.map(_file => _file._id)
      }

      if (+incomingData.type === MessageTypes.CONVERSATION && conversationId) {
        newMessage.conversationId = conversationId
      }

      const result = await MessageModel.create(newMessage)

      if (newMessage.senderId.toString() === newMessage.receiverId.toString() || receiverArray.length === 1) {
        createdMessages.push(result)
      }
    }

    return createdMessages[0]
  }

  async setAsRead({ request, auth }) {
    const ids = request.input("ids")
    const userId = auth.user.id

    await MessageModel.setAsRead(ids, userId)
  }
}

module.exports = ConversationController
