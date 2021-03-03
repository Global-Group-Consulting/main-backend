'use strict'

/** @typedef {import("../../@types/Communications.d").IMessage} IMessage */
/** @typedef {import("../../@types/Request.d").Request} IRequest */
/** @typedef {import("../../@types/User.d").User} IUser */

const Notifications = exports = module.exports = {}

/** @type {typeof import("../Models/Notification")} */
const NotificationModel = use("App/Models/Notification")
/** @type {typeof import("../Models/User")} */
const UserModel = use("App/Models/User")

const Event = use("Event")

const Ws = use("Ws")

const NotificationTypes = require("../../enums/NotificationTypes")
const MessageTypes = require("../../enums/MessageTypes")
const RequestStatus = require("../../enums/RequestStatus")
const RequestTypes = require("../../enums/RequestTypes")


function _userPayload(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  }
}

function _broadcastTo(notification) {
  const channel = Ws.getChannel('notifications')
  const subscribers = channel.getTopicSubscriptions("notifications")
  const topic = channel.topic("notifications")


  // if no one is listening, so the `topic('subscriptions')` method will return `null`
  if (topic) {
    for (const entry of subscribers) {
      if (entry.user._id.toString() === notification.receiverId.toString()) {
        topic.emitTo('newNotification', notification, [entry.id])
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// MESSAGES
///////////////////////////////////////////////////////////////////////////////////////////////////

Notifications.onMessageNew = onMessageNew

/**
 * @param {IMessage} message
 * @returns {Promise<void>}
 */
async function onMessageNew(message) {
  let type

  switch (message.type) {
    case MessageTypes.CONVERSATION:
      type = NotificationTypes.MESSAGE_CHAT
      break;
    case MessageTypes.SERVICE:
    case MessageTypes.BRITE_USE:
      type = NotificationTypes.MESSAGE_COMMUNICATION
      break;
    case MessageTypes.BUG_REPORT:
      type = NotificationTypes.MESSAGE_REPORT
      break;
  }

  const payload = message.toJSON()

  if (payload.files) {
    delete payload.files
  }

  const notification = await NotificationModel.create({
    receiverId: message.receiverId,
    senderId: message.senderId,
    payload,
    type
  })

  _broadcastTo(notification)
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// USERS
///////////////////////////////////////////////////////////////////////////////////////////////////

Notifications.onUserDraftConfirmed = onUserDraftConfirmed
Notifications.onUserIncompleteData = onUserIncompleteData
Notifications.onUserMustRevalidate = onUserMustRevalidate
Notifications.onUserValidated = onUserValidated
Notifications.onUserApproved = onUserApproved

/**
 * Send notification to all servClienti
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserDraftConfirmed(user) {
  const receivers = await UserModel.getServClienti()

  for (const servClientiUser of receivers.rows) {
    const notification = await NotificationModel.create({
      receiverId: servClientiUser._id,
      senderId: user.referenceAgent,
      payload: _userPayload(user),
      type: NotificationTypes.USER_VALIDATE
    })

    _broadcastTo(notification)
  }
}

/**
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserIncompleteData(user) {
  const notification = await NotificationModel.create({
    receiverId: user.referenceAgent,
    payload: _userPayload(user),
    type: NotificationTypes.USER_INCOMPLETE
  })

  _broadcastTo(notification)
}

/**
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserMustRevalidate(user) {
  const receivers = await UserModel.getServClienti()

  for (const servClientiUser of receivers.rows) {
    const notification = await NotificationModel.create({
      receiverId: servClientiUser._id,
      senderId: user.referenceAgent,
      payload: _userPayload(user),
      type: NotificationTypes.USER_REVALIDATE
    })

    _broadcastTo(notification)
  }
}

/**
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserValidated(user) {
  const receivers = await UserModel.getAdmins()

  for (const receiverUser of receivers.rows) {
    const notification = await NotificationModel.create({
      receiverId: receiverUser._id,
      payload: _userPayload(user),
      type: NotificationTypes.USER_SIGN_REQUEST
    })

    _broadcastTo(notification)
  }
}

/**
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserApproved(user) {
  if (!user.referenceAgent) {
    return
  }

  const notification = await NotificationModel.create({
    receiverId: user.referenceAgent,
    payload: _userPayload(user),
    type: NotificationTypes.USER_APPROVED
  })

  _broadcastTo(notification)
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// REQUESTS
///////////////////////////////////////////////////////////////////////////////////////////////////

Notifications.onRequestNew = onRequestNew
Notifications.onRequestApproved = onRequestApproved
Notifications.onRequestRejected = onRequestRejected
Notifications.onRequestCancelled = onRequestCancelled

/**
 * Based on the request type and status,
 * i must decide who must receive a notification, in the user that created it
 * or someone from the admin on serv clienti.
 *
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestNew(request) {
  // If the request is not of the specified types, won't do nothing
  if (![RequestTypes.RISC_CAPITALE, RequestTypes.VERSAMENTO].includes(request.type)) {
    return
  }

  const receivers = await UserModel.getAdmins()
  let type

  switch (request.type) {
    case RequestTypes.VERSAMENTO:
      type = NotificationTypes.REQUEST_DEPOSIT
      break;
    case RequestTypes.RISC_CAPITALE:
      type = NotificationTypes.REQUEST_DEPOSIT_COLLECT
      break;
  }

  for (const receiver of receivers.rows) {
    const notification = await NotificationModel.create({
      receiverId: receiver._id,
      senderId: request.userId,
      payload: request.toJSON(),
      type
    })

    _broadcastTo(notification)
  }
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestRejected(request) {
  const notification = await NotificationModel.create({
    receiverId: request.userId,
    payload: request.toJSON(),
    type: NotificationTypes.REQUEST_REJECTED
  })

  _broadcastTo(notification)
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestCancelled(request) {
  const receivers = await UserModel.getAdmins()

  for (const receiver of receivers.rows) {
    const notification = await NotificationModel.create({
      receiverId: receiver._id,
      senderId: request.userId,
      payload: request.toJSON(),
      type: NotificationTypes.REQUEST_CANCELLED
    })

    _broadcastTo(notification)
  }
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestApproved(request) {
  const notification = await NotificationModel.create({
    receiverId: request.userId,
    payload: request.toJSON(),
    type: NotificationTypes.REQUEST_APPROVED
  })

  _broadcastTo(notification)
}
