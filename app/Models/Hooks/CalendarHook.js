'use strict'

const User = use('App/Models/User')
const Env = use('Env')

/** @type {import('../../../providers/LaravelQueue')} */
const LaravelQueue = use('LaravelQueueProvider')

const { ObjectId } = require('mongodb')

const AclUserRoles = require('../../../enums/AclUserRoles')
const { castToObjectId, formatDate } = require('../../Helpers/ModelFormatters')

const CalendarHook = exports = module.exports = {}

/**
 *
 * @param {CalendarEvent} modelInstance
 * @return {Promise<void>}
 */
CalendarHook.afterCreate = async (modelInstance) => {
  const receivers = []
  
  // if the event is public, send a notification to all users
  if (modelInstance.isPublic) {
    receivers.push(...(await getPublicReceivers(modelInstance.updatedBy)))
  }
  
  // if the event is private, send a notification to the users specified in the event
  // userIds is an array of ObjectId
  // authorId is an ObjectId
  // authorId can be the same as one of the userIds
  if (!modelInstance.isPublic) {
    receivers.push(...(await getReceivers(modelInstance)))
  }
  
  // if there are no receivers, no need to send the notification
  if (!receivers.length) {
    return
  }
  
  sendNotification('Nuovo evento',
    'Un nuovo evento a cui è collegato/a è stato creato. Acceda per maggiori dettagli.',
    receivers,
    `/calendar?date=${formatDate(modelInstance.start, false, "YYYY-MM-DD")}&_id=${modelInstance._id.toString()}`
  )
}

/**
 *
 * @param {CalendarEvent} modelInstance
 * @return {Promise<void>}
 */
CalendarHook.afterUpdate = async (modelInstance) => {
  const receivers = []
  
  // if the event is public, send a notification to all users
  if (modelInstance.isPublic) {
    receivers.push(...(await getPublicReceivers(modelInstance.updatedBy)))
  }
  
  // if the event is private, send a notification to the users specified in the event
  // userIds is an array of ObjectId
  // authorId is an ObjectId
  // authorId can be the same as one of the userIds
  if (!modelInstance.isPublic) {
    receivers.push(...(await getReceivers(modelInstance)))
  }
  
  // if there are no receivers, no need to send the notification
  if (!receivers.length) {
    return
  }
  
  sendNotification('Evento aggiornato',
    'Un evento a cui è collegato/a è stato aggiornato. Acceda per maggiori dettagli.',
    receivers,
    `/calendar?date=${formatDate(modelInstance.start, false, "YYYY-MM-DD")}&_id=${modelInstance._id.toString()}`
  )
}

/**
 *
 * @param {CalendarEvent} modelInstance
 * @return {Promise<User[]>}
 */
async function getReceivers (modelInstance) {
  const updatedBy = modelInstance.updatedBy.toString()
  const receivers = modelInstance.userIds.reduce((acc, userId, i) => {
      // if the userId is not already in the array, add it
      if (!acc.includes(userId.toString())) {
        acc.push(userId.toString())
      }
      
      // when i === 0, decide if the authorId present in the acc array is the same as the updatedBy.
      // if so, remove it from the array
      if (i === 0 && acc.includes(updatedBy)) {
        acc.splice(acc.indexOf(updatedBy), 1)
      }
      
      return acc
    },
    // immediately add the authorId to the receivers
    [modelInstance.authorId.toString()]
  )
  
  if (!receivers.length) {
    return []
  }
  
  const res = await User.where({ '_id': { '$in': receivers } }).select('_id', 'email', 'firstName', 'lastName').fetch()
  
  return res.rows
}

/**
 *
 * @param {ObjectId} creatorId
 * @return {Promise<User[]>}
 */
async function getPublicReceivers (creatorId) {
  // get all users (agents) except the creator
  const res = await User.where({
    'roles': AclUserRoles.AGENT,
    '_id': { '$ne': castToObjectId(creatorId) }
  })
    .select('_id', 'email', 'firstName', 'lastName')
    .fetch()
  
  return res.rows
}

function sendNotification (title, content, receivers, link) {
  LaravelQueue.dispatchCreateNotification({
    title,
    content,
    platforms: ['email'],
    receivers,
    action: {
      text: 'Visualizza evento',
      link: Env.get('APP_URL') + link
    }
  })
}
