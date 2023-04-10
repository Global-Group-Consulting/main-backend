'use strict'

/** @typedef {import('../../@types/Communications.d').IMessage} IMessage */
/** @typedef {import('../../@types/Request.d').Request} IRequest */
/** @typedef {import('../../@types/User.d').User} IUser */

const Notifications = exports = module.exports = {}

/** @type {typeof import('../Models/Notification')} */
const NotificationModel = use('App/Models/Notification')
/** @type {typeof import('../Models/User')} */
const UserModel = use('App/Models/User')

const Event = use('Event')
const Ws = use('Ws')
const Antl = use('Antl')

const NotificationType = require('../../enums/NotificationType')
const MessageTypes = require('../../enums/MessageTypes')
const RequestStatus = require('../../enums/RequestStatus')
const RequestTypes = require('../../enums/RequestTypes')
const NotificationPlatformType = require('../../enums/NotificationPlatformType')
const { formatMoney } = require('../Helpers/ModelFormatters')

const LaravelQueue = use('LaravelQueueProvider')
const Env = use('Env')

function _userPayload (user) {
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
      type = NotificationType.MESSAGE_CHAT
      break;
    case MessageTypes.SERVICE:
    case MessageTypes.BRITE_USE:
      type = NotificationType.MESSAGE_COMMUNICATION
      break
    case MessageTypes.BUG_REPORT:
      type = NotificationType.MESSAGE_REPORT
      break
  }
  
  const payload = message
  
  if (payload.files) {
    delete payload.files
  }
  
  
  await LaravelQueue.dispatchCreateNotification({
    title: message.subject,
    content: message.content,
    receivers: [await UserModel.where('_id', message.receiverId).select('_id', 'firstName', 'lastName', 'email').first()],
    type,
    platforms: [NotificationPlatformType.APP],
    action: {
      'text': 'Leggi messaggio',
      'link': Env.get('PUBLIC_URL') + '/communications#' + (payload.conversationId || payload.id)
    }
  }, payload)
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
  // No more used
  
  return
  /*const receivers = await UserModel.getServClienti()
 
 
 
 for (const servClientiUser of receivers.rows) {
   const notification = await NotificationModel.create({
     receiverId: servClientiUser._id,
     senderId: user.referenceAgent,
     payload: _userPayload(user),
     type: NotificationTypes.USER_VALIDATE
   })

   _broadcastTo(notification)
 }*/
}

/**
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserIncompleteData(user) {
  // No more used
  return
  // const notification = await NotificationModel.create({
  //   receiverId: user.referenceAgent,
  //   payload: _userPayload(user),
  //   type: NotificationTypes.USER_INCOMPLETE
  // })
  //
  // _broadcastTo(notification)
}

/**
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserMustRevalidate(user) {
  // No more used
  return
  /*const receivers = await UserModel.getServClienti()

  for (const servClientiUser of receivers.rows) {
    const notification = await NotificationModel.create({
      receiverId: servClientiUser._id,
      senderId: user.referenceAgent,
      payload: _userPayload(user),
      type: NotificationTypes.USER_REVALIDATE
    })

    _broadcastTo(notification)
  }*/
}

/**
 *
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserValidated(user) {
  // No more used
  return
  // const receivers = await UserModel.getAdmins()
  //
  // for (const receiverUser of receivers.rows) {
  //   const notification = await NotificationModel.create({
  //     receiverId: receiverUser._id,
  //     payload: _userPayload(user),
  //     type: NotificationTypes.USER_SIGN_REQUEST
  //   })
  //
  //   _broadcastTo(notification)
  // }
}

/**
 * @param {IUser} user
 * @returns {Promise<void>}
 */
async function onUserApproved(user) {
  // No more used
  return
  /*if (!user.referenceAgent) {
    return
  }

  const notification = await NotificationModel.create({
    receiverId: user.referenceAgent,
    payload: _userPayload(user),
    type: NotificationTypes.USER_APPROVED
  })

  _broadcastTo(notification)*/
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
  // If the request is not of the specified types, won't do anything
  if (![RequestTypes.RISC_CAPITALE, RequestTypes.VERSAMENTO].includes(request.type)) {
    return
  }
  
  const receivers = await UserModel.getAdmins(['_id', 'firstName', 'lastName', 'email'])
  let type
  
  switch (request.type) {
    case RequestTypes.VERSAMENTO:
      type = NotificationType.REQUEST_DEPOSIT
      break
    case RequestTypes.RISC_CAPITALE:
      type = NotificationType.REQUEST_DEPOSIT_COLLECT
      break
  }
  
  const user = await UserModel.where('_id', request.userId).select('_id', 'firstName', 'lastName', 'email').first()
  
  await LaravelQueue.dispatchCreateNotification({
    title: Antl.compile('it', 'enums.NotificationType.' + type),
    content: Antl.compile('it', 'enums.NotificationType.' + type + 'Message', {
      firstName: user.firstName,
      lastName: user.lastName,
      amount: formatMoney(request.amount)
    }),
    receivers,
    type,
    platforms: [NotificationPlatformType.APP],
    action: {
      'text': 'Visualizza richiesta',
      'link': Env.get('PUBLIC_URL') + '/requests/#' + (request._id)
    }
  })
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestRejected(request) {
  const type = NotificationType.REQUEST_REJECTED
  const user = await UserModel.where('_id', request.userId).select('_id', 'firstName', 'lastName', 'email').first()
  const requestType = Antl.compile('it', `enums.RequestTypes.${RequestTypes.get(request.type).id}`)
  
  await LaravelQueue.dispatchCreateNotification({
    title: Antl.compile('it', 'enums.NotificationType.' + type),
    content: Antl.compile('it', 'enums.NotificationType.' + type + 'Message', {
      amount: formatMoney(request.amount),
      requestType
    }),
    receivers: [user],
    type,
    platforms: [NotificationPlatformType.APP, NotificationPlatformType.EMAIL],
    action: {
      'text': 'Visualizza dettagli',
      'link': Env.get('PUBLIC_URL') + '/requests/#' + (request._id)
    }
  }, {
    ...request.toJSON(),
    requestType,
    'amount': formatMoney(request.amount)
  })
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestCancelled(request) {
  const receivers = await UserModel.getAdmins(['_id', 'firstName', 'lastName', 'email'])
  const type = NotificationType.REQUEST_CANCELLED
  const user = await UserModel.where('_id', request.userId).select('_id', 'firstName', 'lastName', 'email').first()
  
  await LaravelQueue.dispatchCreateNotification({
    title: Antl.compile('it', 'enums.NotificationType.' + type),
    content: Antl.compile('it', 'enums.NotificationType.' + type + 'Message', {
      firstName: user.firstName,
      lastName: user.lastName,
      amount: formatMoney(request.amount)
    }),
    receivers: receivers,
    type,
    platforms: [NotificationPlatformType.APP],
    action: {
      'text': 'Visualizza richiesta',
      'link': Env.get('PUBLIC_URL') + '/requests/#' + (request._id)
    }
  }, {
    ...request.toJSON(),
    'amount': formatMoney(request.amount)
  })
}

/**
 * @param {IRequest} request
 * @returns {Promise<void>}
 */
async function onRequestApproved(request) {
  const type = NotificationType.REQUEST_APPROVED
  const user = await UserModel.where('_id', request.userId).select('_id', 'firstName', 'lastName', 'email').first()
  
  await LaravelQueue.dispatchCreateNotification({
    title: Antl.compile('it', 'enums.NotificationType.' + type),
    content: Antl.compile('it', 'enums.NotificationType.' + type + 'Message', {
      firstName: user.firstName,
      lastName: user.lastName,
      amount: formatMoney(request.amount)
    }),
    receivers: [user],
    type,
    platforms: [NotificationPlatformType.APP, NotificationPlatformType.EMAIL],
    action: {
      'text': 'Visualizza richiesta',
      'link': Env.get('PUBLIC_URL') + '/requests/#' + (request._id)
    }
  }, {
    ...request.toJSON(),
    'amount': formatMoney(request.amount)
  })
  
}
