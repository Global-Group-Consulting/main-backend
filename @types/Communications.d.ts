import { Types as MongoTypes } from "mongoose"
// import LucidModel from '@adonisjs/lucid/src/Lucid/Model'

export interface IMessage {
  id: string
  subject: string
  content: string

  messageId: string

  // Enum of MessageTypes
  type: number

  // For chats like, this is the conversation reference
  conversationId?: MongoTypes.ObjectId

  // Id of the receiver user
  receiverId: MongoTypes.ObjectId

  // Id of the user that created this message.
  senderId: MongoTypes.ObjectId

  // Attachments ids list
  filesIds: MongoTypes.ObjectId[]

  // If the communications is not read in x time, will send it by email.
  sentByEmail: boolean

  read_at: Date
  created_at: Date
  updated_at: Date
}

export interface IConversation {
  watchersIds: MongoTypes.ObjectId[]

  // ID of the user that first created the conversation
  createdById: MongoTypes.ObjectId

  // It of the person who must receive the communication
  directedToId: MongoTypes.ObjectId

  // counter of the messages that contains
  messagesCount: number

  readonly: boolean

  subject: string

  created_at: Date

  // Date of the last time was updated (due to the messages counter)
  updated_at: Date
}