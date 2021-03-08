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

/** @type {typeof import("../../../Models/Request")} */
const RequestModel = use('App/Models/Request')

const UserRoles = require("../../../../enums/UserRoles")

const {Types: MongoTypes} = require("mongoose")

class ConversationController {
  async readConversationMessages({params, auth}) {
    const userRole = +auth.user.role
    const conversationId = params.id

    const toReturn = {
      conversation: await ConversationModel.getMessages(conversationId, auth.user),
    }

    if ([UserRoles.ADMIN, UserRoles.SERV_CLIENTI, UserRoles.AGENTE].includes(userRole)) {
      toReturn.quotableUsers = await UserModel.getQuotableUsers(auth.user._id)
    }

    return toReturn
  }

  async readAll({auth, request}) {
    const requestedType = request.qs["t"]
    const requestedTypeOut = typeof request.qs["out"] === "string"

    let toReturn

    switch (+requestedType) {
      case MessageTypes.CONVERSATION:
        toReturn = await ConversationModel.getAll(auth.user._id)

        break;
      case MessageTypes.SERVICE:
        toReturn = await MessageModel[requestedTypeOut ? "getSimpleMessagesSent" : "getSimpleMessages"](auth.user._id)

        break;
      default:
        const messages = await MessageModel.getSimpleMessages(auth.user._id)
        const messagesSent = await MessageModel.getSimpleMessagesSent(auth.user._id)
        const conversations = await ConversationModel.getAll(auth.user._id, {messageType: {$not: {$eq: MessageTypes.BRITE_USE}}})
        const clubConversations = await ConversationModel.getAll(auth.user._id, {messageType: {$eq: MessageTypes.BRITE_USE}})

        toReturn = {
          messages,
          messagesSent,
          conversations,
          clubConversations
        }
    }

    return toReturn
  }

  async readAllReceivers({auth, request}) {
    const messageType = request.get()["m"]
    const userRole = auth.user.role
    const toReturn = []

    switch (userRole) {
      case UserRoles.CLIENTE:
        if (auth.user.referenceAgent) {
          const referenceAgent = await UserModel.find(auth.user.referenceAgent)

          toReturn.push({
            id: referenceAgent._id.toString(),
            firstName: referenceAgent.firstName,
            lastName: referenceAgent.lastName,
            role: referenceAgent.role
          })
        }

        toReturn.unshift({
          id: null,
          firstName: null,
          lastName: null,
          role: [UserRoles.SERV_CLIENTI, UserRoles.ADMIN]
        })

        break;
      case UserRoles.AGENTE:
        const agentUsers = await UserModel.getReceiversForAgent(auth.user._id)

        toReturn.push(...agentUsers.toJSON())

        toReturn.unshift({
          id: null,
          firstName: null,
          lastName: null,
          role: [UserRoles.SERV_CLIENTI, UserRoles.ADMIN]
        })

        break;
      case UserRoles.SERV_CLIENTI:
        const users = await UserModel.getReceiversUsers(auth.user._id)
        toReturn.push(users.toJSON())

        break;
      case UserRoles.ADMIN:
        if (messageType && +messageType === MessageTypes.CONVERSATION) {
          const users = await UserModel.getReceiversUsers(auth.user._id)
          toReturn.push(users.toJSON())
        } else {
          UserRoles.iterable.forEach(role => {
            toReturn.push({
              id: null,
              firstName: null,
              lastName: null,
              role: role.value
            })
          })
        }

        break;
    }
    // distinguere il ruolo dell'utente e quindi ritornare
    // una lista diversa per ogni ruolo
    // return await UserModel.getReceiversUsers(auth.user._id)
    return toReturn.flat()
  }

  async create({request, auth}) {
    const user = auth.user.toJSON()
    const incomingData = request.only(["type", "subject", "content", "receiver", "requestId"])
    const files = request.file("communicationAttachments")

    let conversationId = request.input("conversationId")
    let createdMessages = []
    let storedFiles = await this._storeFiles(files, user.id)
    let conversation = await this._getConversation(conversationId)
    let receiverArray = await this._prepareReceivers(incomingData, conversation, user.id)

    const messageId = new MongoTypes.ObjectId()

    for (const receiver of receiverArray) {
      const result = await this._createSingleMessage({
        receiver,
        messageId,
        incomingData,
        conversationId,
        user,
        storedFiles
      })

      conversationId = result.conversationId

      createdMessages.push(result)
    }

    return createdMessages.find(_msg => _msg.senderId.toString() === _msg.receiverId.toString()) || createdMessages[0]
  }

  async setAsRead({request, auth}) {
    const ids = request.input("ids")
    const userId = auth.user._id

    await MessageModel.setAsRead(ids, userId)
  }

  async _storeFiles(files, userId) {
    if (files && files.files.length > 0) {
      return await FileModel.store(files.files, userId, userId)
    }
  }

  async _prepareReceivers(incomingData, conversation, userId) {
    const conversationWatchers = conversation ? conversation.watchersIds : []

    /** @type {[]} */
    let toReturn = []

    if (!(incomingData.receiver instanceof Array)) {
      toReturn.push(incomingData.receiver)
    } else {
      toReturn = incomingData.receiver
    }


    for (let i = 0; i < toReturn.length; i++) {
      const receiver = incomingData.receiver[i]

      if (!isNaN(receiver)) {
        const receiversByRole = (await UserModel.getReceiversByRole(+receiver, incomingData.type === MessageTypes.BUG_REPORT))
          .toJSON()
          .reduce((acc, user) => {
            acc.push(user.id.toString())

            return acc
          }, [])

        toReturn.splice(i, 1, receiversByRole)
      }
    }

    toReturn = toReturn.flat()

    const set = new Set([...toReturn.map(_id => _id.toString()), ...conversationWatchers.map(_id => _id.toString())])

    return [...set].filter(_id => _id !== userId.toString())
  }

  async _getConversation(conversationId) {
    if (conversationId) {
      return await ConversationModel.find(conversationId)
    }
  }

  async _createSingleMessage({
                               receiver,
                               messageId,
                               incomingData,
                               user,
                               conversationId,
                               storedFiles
                             }) {

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

    if ([MessageTypes.CONVERSATION, MessageTypes.BRITE_USE].includes(+incomingData.type)) {
      newMessage.conversationId = conversationId ? conversationId : new MongoTypes.ObjectId()

      conversationId = newMessage.conversationId
    }

    if (incomingData.requestId) {
      newMessage.requestId = incomingData.requestId

      await RequestModel.setToWorkingState(incomingData.requestId)
    }

    const result = await MessageModel.create(newMessage)

    return result
  }


}

module.exports = ConversationController
